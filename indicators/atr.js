import pkg from "technicalindicators";

const { ATR } = pkg;

export function atrSignal(candles) {

    const high = candles.map(c => Number(c.high));
    const low = candles.map(c => Number(c.low));
    const close = candles.map(c => Number(c.close));

    const atr = ATR.calculate({
        high,
        low,
        close,
        period: 14
    });

    return {
        value: atr.length ? atr[atr.length - 1] : 0
    };
}