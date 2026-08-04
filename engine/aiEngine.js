export function aiEngine({

    trade,

    confidence,

    bos,

    choch,

    liquidity,

    currentPrice

}) {

    // لا توجد صفقة
    if (!trade) {

        return {

            decision: "🟡 انتظر",

            color: "wait"

        };

    }

    let score = confidence;

    // اتجاه السوق
    if (bos.side === trade.signal)
        score += 5;

    if (choch.side === trade.signal)
        score += 5;

    // سيولة معاكسة
    if (
        liquidity.side !== "WAIT" &&
        liquidity.side !== trade.signal
    ) {

        score -= 20;

    }

    // ربح الصفقة

    let profit = 0;

    if (trade.signal === "BUY") {

        profit =
            currentPrice - trade.entry;

    } else {

        profit =
            trade.entry - currentPrice;

    }

    // =====================
    // القرار
    // =====================

    if (profit >= 2) {

        return {

            decision: "🟠 احمِ أرباحك",

            color: "protect"

        };

    }

    if (profit <= -1) {

        return {

            decision: "🔴 اخرج",

            color: "exit"

        };

    }

    if (score >= 80) {

        return {

            decision: "🟢 استمر",

            color: "buy"

        };

    }

    if (score >= 60) {

        return {

            decision: "🟡 انتظر",

            color: "wait"

        };

    }

    return {

        decision: "🔴 اخرج",

        color: "exit"

    };

}