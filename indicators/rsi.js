import { RSI } from "technicalindicators";

export function rsiSignal(candles) {

    const close = candles.map(c => Number(c.close));

    const rsi = RSI.calculate({
        period: 14,
        values: close
    });

    const last = rsi[rsi.length - 1];

    if (last <= 30) {
        return {
            side: "BUY",
            score: 25,
            value: last,
            reason: "RSI Oversold"
        };
    }

    if (last >= 70) {
        return {
            side: "SELL",
            score: 25,
            value: last,
            reason: "RSI Overbought"
        };
    }

    return {
        side: "WAIT",
        score: 0,
        value: last,
        reason: "RSI Neutral"
    };
}