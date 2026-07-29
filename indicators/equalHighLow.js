export function equalHighLowSignal(candles, tolerance = 0.20) {

    if (candles.length < 20) {

        return {

            side: "WAIT",

            score: 0,

            high: null,

            low: null,

            reason: "Not enough candles"

        };

    }

    for (let i = candles.length - 12; i < candles.length - 1; i++) {

        for (let j = i + 1; j < candles.length; j++) {

            const high1 = Number(candles[i].high);
            const high2 = Number(candles[j].high);

            const low1 = Number(candles[i].low);
            const low2 = Number(candles[j].low);

            if (Math.abs(high1 - high2) <= tolerance) {

                return {

                    side: "SELL",

                    score: 20,

                    high: (high1 + high2) / 2,

                    low: null,

                    reason: "Equal High"

                };

            }

            if (Math.abs(low1 - low2) <= tolerance) {

                return {

                    side: "BUY",

                    score: 20,

                    high: null,

                    low: (low1 + low2) / 2,

                    reason: "Equal Low"

                };

            }

        }

    }

    return {

        side: "WAIT",

        score: 0,

        high: null,

        low: null,

        reason: "No Equal High / Low"

    };

}