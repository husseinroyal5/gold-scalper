import { swingStructure } from "./swing.js";

export function chochSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 10) {
        return {
            side: "WAIT",
            score: 0,
            reason: "Not enough candles"
        };
    }

    const swing = swingStructure(candles);

    if (
        !swing ||
        !Array.isArray(swing.highs) ||
        !Array.isArray(swing.lows) ||
        swing.highs.length < 2 ||
        swing.lows.length < 2
    ) {
        return {
            side: "WAIT",
            score: 0,
            reason: "No CHoCH"
        };
    }

    const high1 = swing.highs[swing.highs.length - 2];
    const high2 = swing.highs[swing.highs.length - 1];

    const low1 = swing.lows[swing.lows.length - 2];
    const low2 = swing.lows[swing.lows.length - 1];

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