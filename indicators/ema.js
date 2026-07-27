import { EMA } from "technicalindicators";

export function emaSignal(candles) {

    const close = candles.map(c => Number(c.close));

    const ema5 = EMA.calculate({
        period: 5,
        values: close
    });

    const ema13 = EMA.calculate({
        period: 13,
        values: close
    });

    const lastEMA5 = ema5[ema5.length - 1];
    const lastEMA13 = ema13[ema13.length - 1];

    if (lastEMA5 > lastEMA13) {
        return {
            side: "BUY",
            score: 25,
            reason: "EMA Bullish"
        };
    }

    if (lastEMA5 < lastEMA13) {
        return {
            side: "SELL",
            score: 25,
            reason: "EMA Bearish"
        };
    }

    return {
        side: "WAIT",
        score: 0,
        reason: "No Trend"
    };

}