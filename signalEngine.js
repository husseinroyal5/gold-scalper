import { emaSignal } from "./indicators/ema.js";
import { rsiSignal } from "./indicators/rsi.js";
import { macdSignal } from "./indicators/macd.js";

export function analyse(candles) {

    const ema = emaSignal(candles);
    const rsi = rsiSignal(candles);
    const macd = macdSignal(candles);

    let buyScore = 0;
    let sellScore = 0;

    // EMA
    if (ema.side === "BUY") buyScore += ema.score;
    if (ema.side === "SELL") sellScore += ema.score;

    // RSI
    if (rsi.side === "BUY") buyScore += rsi.score;
    if (rsi.side === "SELL") sellScore += rsi.score;

    // MACD
    if (macd.side === "BUY") buyScore += macd.score;
    if (macd.side === "SELL") sellScore += macd.score;

    const total = buyScore + sellScore;

    let buyPercent = 50;
    let sellPercent = 50;

    if (total > 0) {

        buyPercent = Math.round((buyScore / total) * 100);
        sellPercent = 100 - buyPercent;

    }

    let signal = "WAIT";

    if (buyScore > sellScore)
        signal = "BUY";

    else if (sellScore > buyScore)
        signal = "SELL";

    return {

        signal,

        confidence: Math.max(buyPercent, sellPercent),

        buyScore,

        sellScore,

        buyPercent,

        sellPercent,

        reasons: [

            ema.reason,

            rsi.reason,

            macd.reason

        ],

        indicators: {

            ema: ema.side,

            rsi: rsi.value.toFixed(2),

            macd: macd.value

        }

    };

}