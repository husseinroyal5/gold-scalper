export function orderBlockSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 25) {

        return {

            side: "WAIT",

            score: 0,

            strength: 0,

            high: null,

            low: null,

            reason: "Not enough candles"

        };

    }

    const lastPrice =
        Number(candles[candles.length - 1].close);

    let best = null;

    const start =
        Math.max(5, candles.length - 40);

    for (let i = start; i < candles.length - 3; i++) {

        const c = candles[i];

        const open = Number(c.open);
        const close = Number(c.close);

        const high = Number(c.high);
        const low = Number(c.low);

        const next1 = candles[i + 1];
        const next2 = candles[i + 2];

        const body1 =
            Math.abs(
                Number(next1.close) -
                Number(next1.open)
            );

        const body2 =
            Math.abs(
                Number(next2.close) -
                Number(next2.open)
            );

        // ==========================
        // Bullish
        // ==========================

        if (

            close < open &&

            Number(next1.close) > high &&

            body1 > body2 * 0.6

        ) {

            if (lastPrice < low)
                continue;

            const distance =
                Math.abs(lastPrice - high);

            if (
                !best ||
                distance < best.distance
            ) {

                best = {

                    side: "BUY",

                    score: 35,

                    strength: 90,

                    high,

                    low,

                    distance,

                    reason: "Bullish Order Block"

                };

            }

        }

        // ==========================
        // Bearish
        // ==========================

        if (

            close > open &&

            Number(next1.close) < low &&

            body1 > body2 * 0.6

        ) {

            if (lastPrice > high)
                continue;

            const distance =
                Math.abs(lastPrice - low);

            if (
                !best ||
                distance < best.distance
            ) {

                best = {

                    side: "SELL",

                    score: 35,

                    strength: 90,

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

        strength: 0,

        high: null,

        low: null,

        reason: "No Order Block"

    };

}