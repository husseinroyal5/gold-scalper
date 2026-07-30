export function orderBlockSignal(candles) {

    if (candles.length < 20) {
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

    for (let i = start; i < candles.length - 2; i++) {

        const c = candles[i];

        const open = Number(c.open);
        const close = Number(c.close);
        const high = Number(c.high);
        const low = Number(c.low);

        const next1 = candles[i + 1];
        const next2 = candles[i + 2];

        if (!next1 || !next2) continue;

        const close1 = Number(next1.close);
        const close2 = Number(next2.close);

        const bullishBreak =
            close1 > high ||
            close2 > high;

        const bearishBreak =
            close1 < low ||
            close2 < low;

        // Bullish Order Block
        if (close < open && bullishBreak) {

            lastSignal = {
                side: "BUY",
                score: 25,
                high,
                low,
                reason: "Bullish Order Block"
            };

        }

        // Bearish Order Block
        if (close > open && bearishBreak) {

            lastSignal = {
                side: "SELL",
                score: 25,
                high,
                low,
                reason: "Bearish Order Block"
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
        reason: "No Order Block"
    };

}