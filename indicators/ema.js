import { EMA } from "technicalindicators";

export function emaSignal(candles) {

    const close = candles.map(c => Number(c.close));

    const ema20 = EMA.calculate({
        period: 20,
        values: close
    });

    const ema50 = EMA.calculate({
        period: 50,
        values: close
    });

    const lastEMA20 = ema20[ema20.length - 1];
    const lastEMA50 = ema50[ema50.length - 1];

    // في حال لم تتوفر بيانات كافية
    if (lastEMA20 === undefined || lastEMA50 === undefined) {
        return {
            ema20: null,
            ema50: null,
            side: "WAIT",
            score: 0,
            reason: "Not enough candles"
        };
    }

    // اتجاه صاعد
    if (lastEMA20 > lastEMA50) {
        return {
            ema20: lastEMA20,
            ema50: lastEMA50,
            side: "BUY",
            score: 30,
            reason: "EMA20 above EMA50"
        };
    }

    // اتجاه هابط
    if (lastEMA20 < lastEMA50) {
        return {
            ema20: lastEMA20,
            ema50: lastEMA50,
            side: "SELL",
            score: 30,
            reason: "EMA20 below EMA50"
        };
    }

    return {
        ema20: lastEMA20,
        ema50: lastEMA50,
        side: "WAIT",
        score: 0,
        reason: "EMA20 equals EMA50"
    };
}