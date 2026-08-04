// ===========================================
// Gold Scalper Pro V3
// Part 1
// ===========================================

import { emaSignal } from "./indicators/ema.js";
import { rsiSignal } from "./indicators/rsi.js";
import { macdSignal } from "./indicators/macd.js";
import { atrSignal } from "./indicators/atr.js";

import { bosSignal } from "./indicators/bos.js";
import { chochSignal } from "./indicators/choch.js";

import { orderBlockSignal } from "./indicators/orderBlock.js";
import { fvgSignal } from "./indicators/fvg.js";
import { liquiditySignal } from "./indicators/liquidity.js";
import { equalHighLowSignal } from "./indicators/equalHighLow.js";
import { supportResistance } from "./indicators/supportResistance.js";

import { entryEngine } from "./engine/entryEngine.js";
import { confidenceEngine } from "./engine/confidenceEngine.js";
import { tradeManager } from "./engine/tradeManager.js";
import { aiEngine } from "./engine/aiEngine.js";

export function analyse(candles) {

    if (!Array.isArray(candles) || candles.length < 60) {

        return {

            signal: "WAIT",

            confidence: 0,

            entry: "--",

            tp1: "--",

            tp2: "--",

            tp3: "--",

            sl: "--",

            trend: "WAIT",

            grade: "D",

            status: "No Data",

            duration: "--",

            reasons: [],

            indicators: {},

            buyPercent: 50,

            sellPercent: 50

        };

    }

    // ==========================================
    // Current Price
    // ==========================================

    const last =
        candles[candles.length - 1];

    const lastPrice =
        Number(last.close);

    // ==========================================
    // Indicators
    // ==========================================

    const ema =
        emaSignal(candles);

    const rsi =
        rsiSignal(candles);

    const macd =
        macdSignal(candles);

    const atr =
        atrSignal(candles);

    const bos =
        bosSignal(candles);

    const choch =
        chochSignal(candles);

    const orderBlock =
        orderBlockSignal(candles);

    const fvg =
        fvgSignal(candles);

    const liquidity =
        liquiditySignal(candles);

    const eql =
        equalHighLowSignal(candles);

    const sr =
    supportResistance(candles);
// ==========================================
// Entry Engine
// ==========================================

const entryResult = entryEngine({

    liquidity,

    orderBlock,

    fvg,

    bos,

    choch,

    price: lastPrice

});

let signal = entryResult.signal;

let entry =
    entryResult.entry !== null
        ? Number(entryResult.entry).toFixed(2)
        : "--";

// ==========================================
// Trend
// ==========================================

let trend = "Sideways";

if (bos.side === "BUY" || ema.side === "BUY")
    trend = "Bullish";

if (bos.side === "SELL" || ema.side === "SELL")
    trend = "Bearish";

// ==========================================
// Status
// ==========================================

let status = "WAIT";

if (signal === "BUY")
    status = "BUY NOW";

if (signal === "SELL")
    status = "SELL NOW";

// ==========================================
// Grade
// ==========================================

let grade = "C";

if (entryResult.strength >= 90)
    grade = "A+";

else if (entryResult.strength >= 80)
    grade = "A";

else if (entryResult.strength >= 70)
    grade = "B";

else if (entryResult.strength >= 60)
    grade = "C";

// ==========================================
// Buy / Sell Power
// ==========================================

let buyPower = 0;
let sellPower = 0;

if (ema.side === "BUY") buyPower += 10;
if (rsi.side === "BUY") buyPower += 8;
if (macd.side === "BUY") buyPower += 10;
if (bos.side === "BUY") buyPower += 18;
if (choch.side === "BUY") buyPower += 18;
if (orderBlock.side === "BUY") buyPower += 15;
if (fvg.side === "BUY") buyPower += 12;
if (liquidity.side === "BUY") buyPower += 9;

if (ema.side === "SELL") sellPower += 10;
if (rsi.side === "SELL") sellPower += 8;
if (macd.side === "SELL") sellPower += 10;
if (bos.side === "SELL") sellPower += 18;
if (choch.side === "SELL") sellPower += 18;
if (orderBlock.side === "SELL") sellPower += 15;
if (fvg.side === "SELL") sellPower += 12;
if (liquidity.side === "SELL") sellPower += 9;

// ==========================================
// Confidence Engine
// ==========================================

const confidenceResult = confidenceEngine({

    ema,

    rsi,

    macd,

    bos,

    choch,

    orderBlock,

    fvg,

    liquidity

});

let confidence =
    confidenceResult.confidence;

let buyPercent = 50;
let sellPercent = 50;

if (signal === "BUY") {

    buyPercent = confidence;
    sellPercent = 100 - confidence;

} else if (signal === "SELL") {

    sellPercent = confidence;
    buyPercent = 100 - confidence;

}

// Bonus

if (
    bos.side === signal &&
    choch.side === signal
) {
    confidence += 5;
}

if (
    orderBlock.side === signal &&
    fvg.side === signal
) {
    confidence += 4;
}

if (
    liquidity.side === signal
) {
    confidence += 3;
}

confidence =
    Math.min(confidence, 99);

// ==========================================
// Trade Manager
// ==========================================

const tradeResult =
    tradeManager({

        signal,

        entry,

        confidence

    },

    lastPrice

);

// ==========================================
// AI Engine
// ==========================================

const aiResult =
    aiEngine({

        trade: tradeResult.trade,

        confidence,

        bos,

        choch,

        liquidity,

        currentPrice: lastPrice

    });

// ==========================================
// AI Decision
// ==========================================

const decision =
    aiResult.decision;

// ==========================================
// Duration
// ==========================================

let duration = "2-7 min";

if (confidence >= 90)
    duration = "1-3 min";

else if (confidence >= 80)
    duration = "2-5 min";
// ==========================================
// TP / SL
// ==========================================

let tp1 = "--";
let tp2 = "--";
let tp3 = "--";
let sl = "--";

const atrValue =
    Number(atr.value ?? 1);

if (signal === "BUY") {

    if (orderBlock.low != null)
        sl = (orderBlock.low - atrValue * 0.20).toFixed(2);

    else if (sr.support != null)
        sl = (sr.support - atrValue * 0.20).toFixed(2);

    const risk =
        Math.abs(lastPrice - Number(sl || lastPrice));

    tp1 = (lastPrice + risk).toFixed(2);
    tp2 = (lastPrice + risk * 2).toFixed(2);
    tp3 = (lastPrice + risk * 3).toFixed(2);

}

if (signal === "SELL") {

    if (orderBlock.high != null)
        sl = (orderBlock.high + atrValue * 0.20).toFixed(2);

    else if (sr.resistance != null)
        sl = (sr.resistance + atrValue * 0.20).toFixed(2);

    const risk =
        Math.abs(Number(sl || lastPrice) - lastPrice);

    tp1 = (lastPrice - risk).toFixed(2);
    tp2 = (lastPrice - risk * 2).toFixed(2);
    tp3 = (lastPrice - risk * 3).toFixed(2);

}

// ==========================================
// Return
// ==========================================

return {

    signal,

    confidence,

    decision,

    entry,

    tp1,

    tp2,

    tp3,

    sl,

    trend,

    grade,

    status,

    duration,

    buyPercent,

    sellPercent,

    reasons: [

        ...entryResult.reasons,

        ...confidenceResult.reasons

    ],

    indicators: {

        ema,

        rsi,

        macd,

        bos,

        choch,

        orderBlock,

        fvg,

        liquidity,

        eql,

        sr,

        atr

    }

};

}