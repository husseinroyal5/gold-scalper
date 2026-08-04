let activeTrade = null;

export function tradeManager(signalData, currentPrice) {

    // ==========================
    // لا توجد صفقة
    // ==========================

    if (!activeTrade) {

        if (
            signalData.signal === "BUY" ||
            signalData.signal === "SELL"
        ) {

            activeTrade = {

                signal: signalData.signal,

                entry: Number(signalData.entry),

                confidence: signalData.confidence,

                openedAt: Date.now(),

                status: "ACTIVE"

            };

        }

        return {

            trade: activeTrade,

            decision: "🟢 استمر"

        };

    }

    // ==========================
    // BUY
    // ==========================

    if (activeTrade.signal === "BUY") {

        const profit =
            currentPrice - activeTrade.entry;

        // أكثر من 2 دولار
        if (profit >= 2) {

            return {

                trade: activeTrade,

                decision: "🟠 احمِ أرباحك"

            };

        }

        // انعكاس
        if (profit <= -1) {

            activeTrade = null;

            return {

                trade: null,

                decision: "🔴 اخرج"

            };

        }

    }

    // ==========================
    // SELL
    // ==========================

    if (activeTrade.signal === "SELL") {

        const profit =
            activeTrade.entry - currentPrice;

        if (profit >= 2) {

            return {

                trade: activeTrade,

                decision: "🟠 احمِ أرباحك"

            };

        }

        if (profit <= -1) {

            activeTrade = null;

            return {

                trade: null,

                decision: "🔴 اخرج"

            };

        }

    }

    return {

        trade: activeTrade,

        decision: "🟢 استمر"

    };

}