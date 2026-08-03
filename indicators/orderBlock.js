export function orderBlockSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 25) {
        return {
            side: "WAIT",
            score: 0,
            high: null,
            low: null,
            reason: "Not enough candles"
        };
    }

    const lastPrice = Number(candles[candles.length - 1].close);

    let best = null;

    const start = Math.max(2, candles.length - 30);

    for (let i = start; i < candles.length - 2; i++) {

        const c = candles[i];

        const open = Number(c.open);
        const close = Number(c.close);
        const high = Number(c.high);
        const low = Number(c.low);

        const next1 = Number(candles[i + 1].close);
        const next2 = Number(candles[i + 2].close);

        // Bullish Order Block
        if (close < open && (next1 > high || next2 > high)) {

            const distance = Math.abs(lastPrice - high);

            if (!best || distance < best.distance) {

                best = {

                    side: "BUY",

                    score: 30,

                    high,

                    low,

                    distance,

                    reason: "Bullish Order Block"

                };

            }

        }

        // Bearish Order Block
        if (close > open && (next1 < low || next2 < low)) {

            const distance = Math.abs(lastPrice - low);

            if (!best || distance < best.distance) {

                best = {

                    side: "SELL",

                    score: 30,

                    high,

                    low,

                    distance,

                    reason: "Bearish Order Block"

                };

            }

        }

    }

    if (best) {

        delete best.distance;

        return best;

    }

    return {

        side: "WAIT",

        score: 0,

        high: null,

        low: null,

        reason: "No Order Block"

    };

}