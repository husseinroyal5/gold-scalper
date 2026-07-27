async function updatePrice() {

    try {

        const response = await fetch("/api/price");
        const data = await response.json();

        if (!data.success) {

            document.getElementById("price").textContent = "No Data";
            return;

        }

        // الأصل
        document.getElementById("symbol").textContent =
            data.symbol;

        // السعر
        document.getElementById("price").textContent =
            data.price;

        // الوقت
        document.getElementById("time").textContent =
            data.time;

        // الإشارة
        const signal = document.getElementById("signal");

        signal.textContent = data.signal;

        signal.style.fontWeight = "bold";
        signal.style.fontSize = "36px";

        switch (data.signal) {

            case "BUY":
                signal.style.color = "#00e676";
                break;

            case "SELL":
                signal.style.color = "#ff5252";
                break;

            default:
                signal.style.color = "#ffd54f";

        }

        // نسبة الثقة
        document.getElementById("confidence").textContent =
            data.confidence + "%";

        // الأسباب
        document.getElementById("reason").textContent =
            data.reasons.join(" | ");

        // المؤشرات
        document.getElementById("ema").textContent =
            data.indicators.ema;

        document.getElementById("rsi").textContent =
            data.indicators.rsi;

        document.getElementById("macd").textContent =
            data.indicators.macd;

        // ==========================
        // شريط قوة البيع والشراء
        // ==========================

        document.getElementById("buyPercent").textContent =
            data.buyPercent + "% شراء";

        document.getElementById("sellPercent").textContent =
            data.sellPercent + "% بيع";

        document.getElementById("buyBar").style.width =
            data.buyPercent + "%";

        document.getElementById("sellBar").style.width =
            data.sellPercent + "%";

        // تدرج لوني حسب القوة

        document.getElementById("buyBar").style.opacity =
            Math.max(0.35, data.buyPercent / 100);

        document.getElementById("sellBar").style.opacity =
            Math.max(0.35, data.sellPercent / 100);

    }

    catch (error) {

        console.error(error);

        document.getElementById("price").textContent =
            "Connection Error";

    }

}

// أول تشغيل
updatePrice();

// تحديث كل 10 ثوانٍ
setInterval(updatePrice, 10000);