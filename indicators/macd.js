import { MACD } from "technicalindicators";

export function macdSignal(candles) {

    const close = candles.map(c => Number(c.close));

    const macd = MACD.calculate({

        values: close,

        fastPeriod: 12,

        slowPeriod: 26,

        signalPeriod: 9,

        SimpleMAOscillator: false,

        SimpleMASignal: false

    });

    const last = macd[macd.length - 1];

    if (!last) {

        return {

            side: "WAIT",

            score: 0,

            value: "0.0000",

            reason: "MACD No Data"

        };

    }

    if (last.MACD > last.signal) {

        return {

            side: "BUY",

            score: 25,

            value: last.histogram.toFixed(4),

            reason: "MACD Bullish"

        };

    }

    if (last.MACD < last.signal) {

        return {

            side: "SELL",

            score: 25,

            value: last.histogram.toFixed(4),

            reason: "MACD Bearish"

        };

    }

    return {

        side: "WAIT",

        score: 0,

        value: last.histogram.toFixed(4),

        reason: "MACD Neutral"

    };

}