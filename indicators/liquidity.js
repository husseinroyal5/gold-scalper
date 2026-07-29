export function liquiditySignal(candles) {

    if (candles.length < 10) {
        return {
            side: "WAIT",
            score: 0,
            level: null,
            reason: "Not enough candles"
        };
    }

    const last = candles[candles.length - 1];

    const prev = candles.slice(candles.length - 6, candles.length - 1);

    const highest = Math.max(...prev.map(c => Number(c.high)));
    const lowest = Math.min(...prev.map(c => Number(c.low)));

    const lastHigh = Number(last.high);
    const lastLow = Number(last.low);
    const lastClose = Number(last.close);

    // Buy Side Liquidity Sweep
    if (lastHigh > highest && lastClose < highest) {

        return {

            side: "SELL",

            score: 25,

            level: highest,

            reason: "Buy Side Liquidity Sweep"

        };

    }

    // Sell Side Liquidity Sweep
    if (lastLow < lowest && lastClose > lowest) {

        return {

            side: "BUY",

            score: 25,

            level: lowest,

            reason: "Sell Side Liquidity Sweep"

        };

    }

    return {

        side: "WAIT",

        score: 0,

        level: null,

        reason: "No Liquidity Sweep"

    };

}