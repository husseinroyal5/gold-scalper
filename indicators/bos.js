import { swingStructure } from "./swing.js";

export function bosSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 10) {

        return {
            side: "WAIT",
            score: 0,
            level: null,
            reason: "Not enough candles"
        };

    }

    const swing = swingStructure(candles);

    if (!swing) {

        return {
            side: "WAIT",
            score: 0,
            level: null,
            reason: "No BOS"
        };

    }

    const last =
        candles[candles.length - 1];

    const high =
        Number(last.high);

    const low =
        Number(last.low);

    if (
        swing.lastHigh &&
        high >= swing.lastHigh.price
    ) {

        return {

            side: "BUY",

            score: 30,

            level: swing.lastHigh.price,

            reason: "Bullish BOS"

        };

    }

    if (
        swing.lastLow &&
        low <= swing.lastLow.price
    ) {

        return {

            side: "SELL",

            score: 30,

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