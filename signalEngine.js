import { emaSignal } from "./indicators/ema.js";
import { rsiSignal } from "./indicators/rsi.js";
import { macdSignal } from "./indicators/macd.js";
import { atrSignal } from "./indicators/atr.js";
import { supportResistance } from "./indicators/supportResistance.js";
import { bosSignal } from "./indicators/bos.js";
import { chochSignal } from "./indicators/choch.js";
import { orderBlockSignal } from "./indicators/orderBlock.js";
import { fvgSignal } from "./indicators/fvg.js";
import { liquiditySignal } from "./indicators/liquidity.js";
import { equalHighLowSignal } from "./indicators/equalHighLow.js";

export function analyse(candles) {

    const ema = emaSignal(candles);
    const rsi = rsiSignal(candles);
    const macd = macdSignal(candles);
    const atr = atrSignal(candles);

    const sr = supportResistance(candles);

    const bos = bosSignal(candles);

    const choch = chochSignal(candles);

    const ob = orderBlockSignal(candles);

    const fvg = fvgSignal(candles);

    const liquidity = liquiditySignal(candles);

    const eql = equalHighLowSignal(candles);

const confirmations = {

    trend: ema.side,

    structure:
        bos.side === choch.side
            ? bos.side
            : "WAIT",

    smartMoney:
        ob.side === fvg.side
            ? ob.side
            : "WAIT",

    liquidity:
        liquidity.side === eql.side
            ? liquidity.side
            : "WAIT"

};

    let buyScore = 0;
    let sellScore = 0;

    if (ema.side === "BUY")
        buyScore += ema.score;
    if (ema.side === "SELL")
        sellScore += ema.score;

    if (rsi.side === "BUY")
        buyScore += rsi.score;
    if (rsi.side === "SELL")
        sellScore += rsi.score;

    if (macd.side === "BUY")
        buyScore += macd.score;
    if (macd.side === "SELL")
        sellScore += macd.score;

    if (bos.side === "BUY")
        buyScore += bos.score;
    if (bos.side === "SELL")
        sellScore += bos.score;

    if (choch.side === "BUY")
        buyScore += choch.score;
    if (choch.side === "SELL")
        sellScore += choch.score;

    if (ob.side === "BUY")
        buyScore += ob.score;
    if (ob.side === "SELL")
        sellScore += ob.score;

    if (fvg.side === "BUY")
        buyScore += fvg.score;
    if (fvg.side === "SELL")
        sellScore += fvg.score;

    if (liquidity.side === "BUY")
        buyScore += liquidity.score;
    if (liquidity.side === "SELL")
        sellScore += liquidity.score;

    if (eql.side === "BUY")
        buyScore += eql.score;
    if (eql.side === "SELL")
        sellScore += eql.score;

    const totalScore = buyScore + sellScore;

    let buyPercent = 50;
    let sellPercent = 50;

    if (totalScore > 0) {

        buyPercent = Math.round((buyScore / totalScore) * 100);

        sellPercent = 100 - buyPercent;

    }

let signal = "WAIT";

const buyConfirmations = [

    ema.side === "BUY",
    rsi.side === "BUY",
    macd.side === "BUY",
    bos.side === "BUY",
    choch.side === "BUY",
    ob.side === "BUY",
    fvg.side === "BUY",
    liquidity.side === "BUY",
    eql.side === "BUY"

].filter(Boolean).length;

const sellConfirmations = [

    ema.side === "SELL",
    rsi.side === "SELL",
    macd.side === "SELL",
    bos.side === "SELL",
    choch.side === "SELL",
    ob.side === "SELL",
    fvg.side === "SELL",
    liquidity.side === "SELL",
    eql.side === "SELL"

].filter(Boolean).length;

// نظام نقاط مرن بدلاً من التطابق الإجباري

if (
    buyConfirmations >= 4 &&
    buyScore > sellScore
) {

    signal = "BUY";

} else if (
    sellConfirmations >= 4 &&
    sellScore > buyScore
) {

    signal = "SELL";

} else {

    signal = "WAIT";

}

let confidence = Math.max(buyPercent, sellPercent);

if (signal === "BUY")
    confidence = Math.min(buyConfirmations * 16, 99);

if (signal === "SELL")
    confidence = Math.min(sellConfirmations * 16, 99);

if (signal === "WAIT")
    confidence = Math.max(buyPercent, sellPercent);
// Bonus Confidence

if (
    bos.side === signal &&
    choch.side === signal
) {
    confidence += 3;
}

if (
    ob.side === signal &&
    fvg.side === signal
) {
    confidence += 3;
}

if (
    liquidity.side === signal
) {
    confidence += 2;
}
if (
    ema.side === signal &&
    macd.side === signal
) {
    confidence += 2;
}

confidence = Math.min(confidence, 99);
    const lastPrice = Number(candles[candles.length - 1].close);

    const atrValue = Number(atr.value || 0);

    let entry = "--";
    let tp1 = "--";
    let tp2 = "--";
    let tp3 = "--";
    let sl = "--";

let trend = "Sideways";
let status = "No Trade";

if (signal === "BUY") {
    trend = "Bullish";
    status = "Waiting Entry";
}

if (signal === "SELL") {
    trend = "Bearish";
    status = "Waiting Entry";
}
    if (signal === "BUY") {

        trend = "Bullish";

        status = "Waiting Entry";

        entry = lastPrice.toFixed(2);

        if (ob.low !== null) {

    sl = (ob.low - atrValue * 0.15).toFixed(2);

} else if (eql.low !== null) {

    sl = (eql.low - atrValue * 0.20).toFixed(2);

} else {

    sl = (sr.support - atrValue * 0.20).toFixed(2);

}

        const risk = Math.abs(lastPrice - Number(sl));

tp1 = (lastPrice + risk).toFixed(2);

tp2 = (lastPrice + risk * 2).toFixed(2);

if (fvg.high !== null) {

    tp3 = Number(fvg.high).toFixed(2);

} else if (liquidity.level !== null) {

    tp3 = Number(liquidity.level).toFixed(2);

} else {

    tp3 = (lastPrice + risk * 3).toFixed(2);

}

    }

    if (signal === "SELL") {

        trend = "Bearish";

        status = "Waiting Entry";

        entry = lastPrice.toFixed(2);

        if (ob.high !== null) {

    sl = (ob.high + atrValue * 0.15).toFixed(2);

} else if (eql.high !== null) {

    sl = (eql.high + atrValue * 0.20).toFixed(2);

} else {

    sl = (sr.resistance + atrValue * 0.20).toFixed(2);

}

        const risk = Math.abs(Number(sl) - lastPrice);

tp1 = (lastPrice - risk).toFixed(2);

tp2 = (lastPrice - risk * 2).toFixed(2);

if (fvg.low !== null) {

    tp3 = Number(fvg.low).toFixed(2);

} else if (liquidity.level !== null) {

    tp3 = Number(liquidity.level).toFixed(2);

} else {

    tp3 = (lastPrice - risk * 3).toFixed(2);

}

    }

    let grade = "C";

    if (confidence >= 95)
        grade = "A+";
    else if (confidence >= 90)
        grade = "A";
    else if (confidence >= 85)
        grade = "B+";
    else if (confidence >= 80)
        grade = "B";
    else if (confidence >= 70)
        grade = "C+";
return {

        signal,

        confidence,

        buyScore,

        sellScore,

        buyPercent,

        sellPercent,

        entry,

        tp1,

        tp2,

        tp3,

        sl,

        trend,

        grade,

        status,

        duration: "2-7 min",

        reasons: [

            ema.reason,

            rsi.reason,

            macd.reason,

            bos.reason,

            choch.reason,

            ob.reason,

            fvg.reason,

            liquidity.reason,

            eql.reason

        ].filter(Boolean),

        indicators: {

            ema20: ema.ema20
                ? ema.ema20.toFixed(2)
                : "-",

            ema50: ema.ema50
                ? ema.ema50.toFixed(2)
                : "-",

            rsi: rsi.value
                ? rsi.value.toFixed(2)
                : "-",

            macd: macd.value,

            atr: atrValue.toFixed(2),

            support: sr.support.toFixed(2),

            resistance: sr.resistance.toFixed(2),

            bos: bos.side,

            choch: choch.side,

            orderBlock: ob.side,

            fvg: fvg.side,

            fvgHigh:
                fvg.high !== null
                    ? Number(fvg.high).toFixed(2)
                    : "-",

            fvgLow:
                fvg.low !== null
                    ? Number(fvg.low).toFixed(2)
                    : "-",

            liquidity: liquidity.side,

            liquidityLevel:
                liquidity.level !== null
                    ? Number(liquidity.level).toFixed(2)
                    : "-",

            equalHighLow: eql.side,

            equalHigh:
                eql.high !== null
                    ? Number(eql.high).toFixed(2)
                    : "-",

            equalLow:
                eql.low !== null
                    ? Number(eql.low).toFixed(2)
                    : "-"

        }

    };

}