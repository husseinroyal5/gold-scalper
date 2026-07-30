export function fvgSignal(candles) {

    if (candles.length < 10) {
        return {
            side: "WAIT",
            score: 0,
            high: null,
            low: null,
            reason: "Not enough candles"
        };
    }

    let lastSignal = null;

    const start = Math.max(2, candles.length - 50);

    for (let i = start; i < candles.length; i++) {

        const c1 = candles[i - 2];
        const c2 = candles[i - 1];
        const c3 = candles[i];

        const high1 = Number(c1.high);
        const low1 = Number(c1.low);

        const high3 = Number(c3.high);
        const low3 = Number(c3.low);

        // Bullish FVG
        if (low3 > high1) {

            lastSignal = {
                side: "BUY",
                score: 25,
                high: low3,
                low: high1,
                reason: "Bullish FVG"
            };

        }

        // Bearish FVG
        if (high3 < low1) {

            lastSignal = {
                side: "SELL",
                score: 25,
                high: low1,
                low: high3,
                reason: "Bearish FVG"
            };

        }

    }

    if (lastSignal)
        return lastSignal;

    return {
        side: "WAIT",
        score: 0,
        high: null,
        low: null,
        reason: "No FVG"
    };

}