import { swingStructure } from "./swing.js";

export function bosSignal(candles) {

    const swing = swingStructure(candles);

    const lastClose = Number(candles[candles.length - 1].close);

    if (swing.lastHigh && lastClose > swing.lastHigh.price) {

        return {

            side: "BUY",

            score: 25,

            level: swing.lastHigh.price,

            reason: "Bullish BOS"

        };

    }

    if (swing.lastLow && lastClose < swing.lastLow.price) {

        return {

            side: "SELL",

            score: 25,

            level: swing.lastLow.price,

            reason: "Bearish BOS"

        };

    }

    return {

        side: "WAIT",

        score: 0,

        level: null,

        reason: "No BOS"

    };

}