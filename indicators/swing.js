export function swingStructure(candles, left = 3, right = 3) {

    const highs = [];
    const lows = [];

    for (let i = left; i < candles.length - right; i++) {

        const high = Number(candles[i].high);
        const low = Number(candles[i].low);

        let isHigh = true;
        let isLow = true;

        for (let j = i - left; j <= i + right; j++) {

            if (j === i) continue;

            if (Number(candles[j].high) >= high)
                isHigh = false;

            if (Number(candles[j].low) <= low)
                isLow = false;
        }

        if (isHigh)
            highs.push({
                index: i,
                price: high
            });

        if (isLow)
            lows.push({
                index: i,
                price: low
            });

    }

    return {

        highs,

        lows,

        lastHigh: highs.length ? highs[highs.length - 1] : null,

        lastLow: lows.length ? lows[lows.length - 1] : null

    };

}