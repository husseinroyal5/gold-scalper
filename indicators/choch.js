import { swingStructure } from "./swing.js";

export function chochSignal(candles) {

    const swing = swingStructure(candles);

    if (
        swing.swingHighs.length < 2 ||
        swing.swingLows.length < 2
    ) {

        return {

            side: "WAIT",

            score: 0,

            reason: "No CHoCH"

        };

    }

    const high1 =
        swing.swingHighs[swing.swingHighs.length - 2];

    const high2 =
        swing.swingHighs[swing.swingHighs.length - 1];

    const low1 =
        swing.swingLows[swing.swingLows.length - 2];

    const low2 =
        swing.swingLows[swing.swingLows.length - 1];

    if (high2.price > high1.price && low2.price > low1.price) {

        return {

            side: "BUY",

            score: 20,

            reason: "Bullish CHoCH"

        };

    }

    if (high2.price < high1.price && low2.price < low1.price) {

        return {

            side: "SELL",

            score: 20,

            reason: "Bearish CHoCH"

        };

    }

    return {

        side: "WAIT",

        score: 0,

        reason: "No CHoCH"

    };

}