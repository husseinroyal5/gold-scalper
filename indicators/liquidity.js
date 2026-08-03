export function liquiditySignal(candles) {

    if (!Array.isArray(candles) || candles.length < 10) {

        return {
            side: "WAIT",
            score: 0,
            level: null,
            reason: "Not enough candles"
        };

    }

    // نبحث في آخر 3 شمعات بدلاً من شمعة واحدة
    for (let i = candles.length - 3; i < candles.length; i++) {

        if (i < 5) continue;

        const last = candles[i];

        const prev = candles.slice(i - 5, i);

        const highest = Math.max(...prev.map(c => Number(c.high)));
        const lowest = Math.min(...prev.map(c => Number(c.low)));

        const lastHigh = Number(last.high);
        const lastLow = Number(last.low);
        const lastClose = Number(last.close);

        // Buy Side Liquidity Sweep
        if (lastHigh > highest && lastClose < highest) {

            return {

                side: "SELL",

                score: 30,

                level: highest,

                reason: "Buy Side Liquidity Sweep"

            };

        }

        // Sell Side Liquidity Sweep
        if (lastLow < lowest && lastClose > lowest) {

            return {

                side: "BUY",

                score: 30,

                level: lowest,

                reason: "Sell Side Liquidity Sweep"

            };

        }

    }

    return {

        side: "WAIT",

        score: 0,

        level: null,

        reason: "No Liquidity Sweep"

    };

}