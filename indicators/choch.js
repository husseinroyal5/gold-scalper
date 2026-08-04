import { swingStructure } from "./swing.js";

export function chochSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 10) {

        return {

            side: "WAIT",

            score: 0,

            reason: "Not enough candles"

        };

    }

    const swing =
        swingStructure(candles);

    if (
        !swing ||
        swing.highs.length < 2 ||
        swing.lows.length < 2
    ) {

        return {

            side: "WAIT",

            score: 0,

            reason: "No CHoCH"

        };

    }

    const high1 =
        swing.highs.at(-2);

    const high2 =
        swing.highs.at(-1);

    const low1 =
        swing.lows.at(-2);

    const low2 =
        swing.lows.at(-1);

    const last =
        candles[candles.length - 1];

    const high =
        Number(last.high);

    const low =
        Number(last.low);

    if (

        high2.price > high1.price &&

        high >= high1.price

    ) {

        return {

            side: "BUY",

            score: 25,

            reason: "Bullish CHoCH"

        };

    }

    if (

        low2.price < low1.price &&

        low <= low1.price

    ) {

        return {

            side: "SELL",

            score: 25,

            reason: "Bearish CHoCH"

        };

    }

    return {

        side: "WAIT",

        score: 0,

        reason: "No CHoCH"

    };

}