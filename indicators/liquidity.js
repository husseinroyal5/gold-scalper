export function liquiditySignal(candles) {

    if (!Array.isArray(candles) || candles.length < 20) {

        return {
            side: "WAIT",
            score: 0,
            level: null,
            strength: 0,
            reason: "Not enough candles"
        };

    }

    const lastPrice =
        Number(candles[candles.length - 1].close);

    let best = null;

    // آخر 10 شمعات فقط
    for (let i = candles.length - 10; i < candles.length; i++) {

        if (i < 5) continue;

        const candle = candles[i];

        const prev = candles.slice(i - 5, i);

        const highest =
            Math.max(...prev.map(c => Number(c.high)));

        const lowest =
            Math.min(...prev.map(c => Number(c.low)));

        const high = Number(candle.high);
        const low = Number(candle.low);
        const close = Number(candle.close);

        // =====================
        // Buy Side Sweep
        // =====================

        if (high > highest && close < highest) {

            const distance =
                Math.abs(lastPrice - highest);

            if (!best || distance < best.distance) {

                best = {

                    side: "SELL",

                    score: 35,

                    strength: 90,

                    level: highest,

                    distance,

                    reason: "Buy Side Liquidity Sweep"

                };

            }

        }

        // =====================
        // Sell Side Sweep
        // =====================

        if (low < lowest && close > lowest) {

            const distance =
                Math.abs(lastPrice - lowest);

            if (!best || distance < best.distance) {

                best = {

                    side: "BUY",

                    score: 35,

                    strength: 90,

                    level: lowest,

                    distance,

                    reason: "Sell Side Liquidity Sweep"

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

        strength: 0,

        level: null,

        reason: "No Liquidity Sweep"

    };

}