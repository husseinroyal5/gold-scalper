export function orderBlockSignal(candles) {

    if (candles.length < 15) {
        return {
            side: "WAIT",
            score: 0,
            high: null,
            low: null,
            reason: "Not enough candles"
        };
    }

    for (let i = candles.length - 6; i >= 2; i--) {

        const c = candles[i];

        const open = Number(c.open);
        const close = Number(c.close);
        const high = Number(c.high);
        const low = Number(c.low);

        const next1 = candles[i + 1];
        const next2 = candles[i + 2];

        if (!next1 || !next2) continue;

        const moveUp =
            Number(next1.close) > high &&
            Number(next2.close) > high;

        const moveDown =
            Number(next1.close) < low &&
            Number(next2.close) < low;

        // Bullish Order Block
        if (close < open && moveUp) {
            return {
                side: "BUY",
                score: 25,
                high,
                low,
                reason: "Bullish Order Block"
            };
        }

        // Bearish Order Block
        if (close > open && moveDown) {
            return {
                side: "SELL",
                score: 25,
                high,
                low,
                reason: "Bearish Order Block"
            };
        }

    }

    return {
        side: "WAIT",
        score: 0,
        high: null,
        low: null,
        reason: "No Order Block"
    };

}