export function supportResistance(candles) {

    const highs = candles.map(c => Number(c.high));
    const lows = candles.map(c => Number(c.low));

    const lookback = Math.min(20, candles.length);

    const recentHighs = highs.slice(-lookback);
    const recentLows = lows.slice(-lookback);

    const resistance = Math.max(...recentHighs);
    const support = Math.min(...recentLows);

    return {
        support,
        resistance
    };

}