import { RSI } from "technicalindicators";

export function rsiSignal(candles) {

    const close = candles.map(c => Number(c.close));

    const rsi = RSI.calculate({
        period: 14,
        values: close
    });

    const last = rsi[rsi.length - 1];

if (last <= 40) {
    return {
        side: "BUY",
        score: 20,
        value: last,
        reason: "RSI Bullish"
    };
}

if (last >= 60) {
    return {
        side: "SELL",
        score: 20,
        value: last,
        reason: "RSI Bearish"
    };
}

return {
    side: "WAIT",
    score: 0,
    value: last,
    reason: "RSI Neutral"
};

    return {
        side: "WAIT",
        score: 0,
        value: last,
        reason: "RSI Neutral"
    };
}