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

        document.getElementById("tp1").textContent =
            data.tp1 ?? "--";

        document.getElementById("tp2").textContent =
            data.tp2 ?? "--";

        document.getElementById("tp3").textContent =
            data.tp3 ?? "--";

        document.getElementById("sl").textContent =
            data.sl ?? "--";

        // =========================
        // Statistics
        // =========================

        document.getElementById("confidence").textContent =
            (data.confidence ?? 0) + "%";

        document.getElementById("grade").textContent =
            data.grade ?? "--";

        document.getElementById("trend").textContent =
            data.trend ?? "--";

        document.getElementById("status").textContent =
            data.status ?? "--";

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