import express from "express";
import { getCandles } from "./api.js";
import { analyse } from "./signalEngine.js";

const app = express();

app.use(express.static("public"));

app.get("/api/price", async (req, res) => {

    try {

        const candles = await getCandles();

        if (!candles || candles.length === 0) {

            return res.json({

                success: false,
                message: "No candle data"

            });

        }

        const last = candles[candles.length - 1];

        const analysis = analyse(candles);

        res.json({

            success: true,

            symbol: "XAU/USD",

            price: last.close,

            time: last.datetime,

            signal: analysis.signal,

            confidence: analysis.confidence,

            buyPercent: analysis.buyPercent,

            sellPercent: analysis.sellPercent,

            reasons: analysis.reasons,

            indicators: analysis.indicators

        });

    }

    catch (err) {

        console.error(err);

        res.json({

            success: false,

            message: err.message

        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});