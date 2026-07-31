async function loadSignal() {

    try {

        const res = await fetch("/api/signal");
        const data = await res.json();

        // =========================
        // Market
        // =========================

        document.getElementById("symbol").textContent =
            data.symbol || "XAU/USD";

        document.getElementById("price").textContent =
            data.price ?? "--";

        document.getElementById("time").textContent =
            data.time || new Date().toLocaleTimeString();

        // =========================
        // Signal
        // =========================

        const signalElement = document.getElementById("signal");

        signalElement.textContent = data.signal;

        signalElement.classList.remove("buy", "sell", "wait");

        switch (data.signal) {

            case "BUY":
                signalElement.classList.add("buy");
                break;

            case "SELL":
                signalElement.classList.add("sell");
                break;

            default:
                signalElement.classList.add("wait");

        }

        // =========================
        // Trade Levels
        // =========================

        document.getElementById("entry").textContent =
            data.entry ?? "--";


        // =========================
        // Statistics
        // =========================

        document.getElementById("confidence").textContent =
            (data.confidence ?? 0) + "%";

        document.getElementById("grade").textContent =
            data.grade ?? "--";

        document.getElementById("trend").textContent =
            data.trend ?? "--";

        const status = document.getElementById("status");

status.textContent =
    data.decision ?? data.status ?? "--";

status.classList.remove(
    "buy",
    "sell",
    "wait"
);

if (data.decision?.includes("استمر")) {

    status.classList.add("buy");

} else if (
    data.decision?.includes("اخرج")
) {

    status.classList.add("sell");

} else {

    status.classList.add("wait");

}

const decision = document.getElementById("decision");

if (decision) {

    decision.textContent =
        data.debugDecision ?? data.decision ?? "--";

    if (decision.textContent.includes("استمر")) {
        decision.style.color = "#00e676";
    } else if (decision.textContent.includes("انتظر")) {
        decision.style.color = "#FFD600";
    } else if (decision.textContent.includes("احم")) {
        decision.style.color = "#ff9800";
    } else if (decision.textContent.includes("اخرج")) {
        decision.style.color = "#ff1744";
    }

}

        document.getElementById("duration").textContent =
            data.duration ?? "--";

        // =========================
        // Buy Sell Power
        // =========================

        const buyPercent = data.buyPercent ?? 50;
        const sellPercent = data.sellPercent ?? 50;

        document.getElementById("buyPercent").textContent =
            buyPercent + "% BUY";

        document.getElementById("sellPercent").textContent =
            sellPercent + "% SELL";

        document.getElementById("buyBar").style.width =
            buyPercent + "%";

        document.getElementById("sellBar").style.width =
            sellPercent + "%";

        // =========================
        // Indicators
        // =========================

        document.getElementById("ema20").textContent =
            data.indicators?.ema20 ?? "-";

        document.getElementById("ema50").textContent =
            data.indicators?.ema50 ?? "-";

        document.getElementById("rsi").textContent =
            data.indicators?.rsi ?? "-";

        document.getElementById("macd").textContent =
            data.indicators?.macd ?? "-";

        document.getElementById("atr").textContent =
            data.indicators?.atr ?? "-";

        // =========================
        // Reasons
        // =========================

        const reason = Array.isArray(data.reasons)
            ? data.reasons.join(" | ")
            : (data.reason || "--");

        document.getElementById("reason").textContent = reason;

    } catch (err) {

        console.error(err);

        document.getElementById("signal").textContent = "ERROR";

    }

}

// تحميل أول مرة
loadSignal();

// تحديث كل 10 ثوانٍ
setInterval(loadSignal, 10000);