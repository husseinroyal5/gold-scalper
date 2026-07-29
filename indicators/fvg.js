export function fvgSignal(candles) {

    if (candles.length < 5) {
        return {
            side: "WAIT",
            score: 0,
            high: null,
            low: null,
            reason: "Not enough candles"
        };
    }

    const c1 = candles[candles.length - 3];
    const c2 = candles[candles.length - 2];
    const c3 = candles[candles.length - 1];

    const high1 = Number(c1.high);
    const low1 = Number(c1.low);

    const high3 = Number(c3.high);
    const low3 = Number(c3.low);

    // Bullish FVG
    if (low3 > high1) {
        return {
            side: "BUY",
            score: 25,
            high: low3,
            low: high1,
            reason: "Bullish FVG"
        };
    }

    // Bearish FVG
    if (high3 < low1) {
        return {
            side: "SELL",
            score: 25,
            high: low1,
            low: high3,
            reason: "Bearish FVG"
        };
    }

    return {
        side: "WAIT",
        score: 0,
        high: null,
        low: null,
        reason: "No FVG"
    };

}