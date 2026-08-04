export function fvgSignal(candles) {

    if (!Array.isArray(candles) || candles.length < 20) {

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
        Math.max(2, candles.length - 40);

    for (let i = start; i < candles.length; i++) {

        const c1 = candles[i - 2];
        const c2 = candles[i - 1];
        const c3 = candles[i];

        const high1 = Number(c1.high);
        const low1 = Number(c1.low);

        const high3 = Number(c3.high);
        const low3 = Number(c3.low);

        const body =
            Math.abs(
                Number(c2.close) -
                Number(c2.open)
            );

        const range =
            Number(c2.high) -
            Number(c2.low);

        // تجاهل الشموع الضعيفة
        if (body < range * 0.50)
            continue;

        // =====================
        // Bullish FVG
        // =====================

        if (low3 > high1) {

            const gapLow = high1;
            const gapHigh = low3;

            // الفجوة أصبحت غير صالحة
            if (lastPrice < gapLow)
                continue;

            const distance =
                Math.abs(lastPrice - gapLow);

            if (!best || distance < best.distance) {

                best = {

                    side: "BUY",

                    score: 35,

                    strength: 90,

                    high: gapHigh,

                    low: gapLow,

                    distance,

                    reason: "Bullish FVG"

                };

            }

        }

        // =====================
        // Bearish FVG
        // =====================

        if (high3 < low1) {

            const gapHigh = low1;
            const gapLow = high3;

            if (lastPrice > gapHigh)
                continue;

            const distance =
                Math.abs(lastPrice - gapHigh);

            if (!best || distance < best.distance) {

                best = {

                    side: "SELL",

                    score: 35,

                    strength: 90,

                    high: gapHigh,

                    low: gapLow,

                    distance,

                    reason: "Bearish FVG"

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

        reason: "No FVG"

    };

}