import express from "express";
import session from "express-session";
import bcrypt from "bcrypt";

import { getCandles } from "./api.js";
import { analyse } from "./signalEngine_v3.js";

import db, { validateLicense } from "./database.js";
import { requireAuth } from "./middleware/auth.js";

// =======================
// Active Trade
// =======================

let activeTrade = null;

const app = express();

app.use(express.json());

app.use(session({
    secret: "ROYAL_GOLD_SCALPER_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));

// الملفات العامة المسموح بها بدون تسجيل دخول
app.use("/login.html", express.static("public/login.html"));
app.use("/style.css", express.static("public/style.css"));
app.use("/app.js", express.static("public/app.js"));

app.get("/", (req, res) => {

    if (req.session.authenticated) {
        return res.sendFile(process.cwd() + "/public/index.html");
    }

    return res.redirect("/login.html");

});

// تسجيل دخول المشترك
app.post("/api/login", (req, res) => {

    const { key } = req.body;

    const result = validateLicense(key);

    if (!result.valid) {
        return res.status(401).json({
            success: false,
            message: result.reason
        });
    }

    req.session.authenticated = true;
    req.session.license = result.license.license_key;

    res.json({
        success: true
    });

});

// تسجيل دخول المدير
app.post("/api/admin/login", (req, res) => {

    const { username, password } = req.body;

    const admin = db.prepare(`
        SELECT *
        FROM admins
        WHERE username = ?
    `).get(username);

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة"
        });
    }

    const ok = bcrypt.compareSync(password, admin.password);

    if (!ok) {
        return res.status(401).json({
            success: false,
            message: "اسم المستخدم أو كلمة المرور غير صحيحة"
        });
    }

    req.session.isAdmin = true;
    req.session.adminUsername = admin.username;

    res.json({
        success: true
    });

});

// حماية جميع ملفات الموقع بعد تسجيل الدخول
app.use(requireAuth);
app.use(express.static("public"));

function requireAdmin(req, res, next) {

    if (req.session && req.session.isAdmin) {
        return next();
    }

    return res.redirect("/admin-login.html");

}

app.get("/api/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/login.html");
    });

});

function getAIDecision(analysis, currentPrice) {

    let score = 0;

    // الاتجاه
    if (analysis.trend === "Bullish") score++;
    if (analysis.trend === "Bearish") score++;

    // الثقة
    if (analysis.confidence >= 80) score += 2;
    else if (analysis.confidence >= 60) score++;

    // RSI
    const rsi = analysis.indicators?.rsi;

    if (rsi > 70) score--;
    if (rsi < 30) score++;

    // MACD
    if (
        analysis.reasons?.some(r => r.includes("MACD Bullish"))
    ) score++;

    if (
        analysis.reasons?.some(r => r.includes("MACD Bearish"))
    ) score--;

    // BOS
    if (
        analysis.reasons?.some(r => r.includes("BOS"))
    ) score++;

    // CHoCH
    if (
        analysis.reasons?.some(r => r.includes("CHoCH"))
    ) score--;

    // القرار النهائي
    if (score >= 4)
        return "🟢 استمر";

    if (score >= 2)
        return "🟠 احمِ أرباحك";

    if (score >= 1)
        return "🟡 انتظر";

    return "🔴 اخرج";

}

app.get("/api/signal", requireAuth, async (req, res) => {

    try {

        const candles = await getCandles();

        if (!candles || candles.length === 0) {
            return res.json({
                success: false,
                message: "No candle data"
            });
        }

        const last = candles[candles.length - 1];

        let analysis;

// إذا توجد صفقة مفتوحة
if (activeTrade) {

    analysis = {
        ...activeTrade
    };

    analysis.price = Number(last.close).toFixed(2);
    const currentPrice = Number(last.close);
const entry = Number(activeTrade.entry);
const sl = Number(activeTrade.sl);

let decision = "🟢 استمر";

if (activeTrade.signal === "BUY") {

    if (currentPrice <= sl) {

        decision = "🔴 اخرج";

        activeTrade = null;

    } else if (currentPrice <= entry) {

        decision = "🟡 انتظر";

    }

}

if (activeTrade && activeTrade.signal === "SELL") {

    if (currentPrice >= sl) {

        decision = "🔴 اخرج";

        activeTrade = null;

    } else if (currentPrice >= entry) {

        decision = "🟡 انتظر";

    }

}

if (activeTrade)
    analysis.decision = decision;

} else {

    analysis = analyse(candles);
analysis.decision = getAIDecision(
    analysis,
    Number(last.close)
);

    if (
        analysis.signal === "BUY" ||
        analysis.signal === "SELL"
    ) {

        activeTrade = {

            signal: analysis.signal,

            decision: analysis.decision,

            entry: analysis.entry,

            sl: analysis.sl,

            trend: analysis.trend,

            confidence: analysis.confidence,

            grade: analysis.grade,

            status: analysis.status,

            duration: analysis.duration,

            reasons: analysis.reasons,

            indicators: analysis.indicators

        };

    }

}
        res.json({

debugDecision: analysis.decision,
debugSignal: analysis.signal,

            success: true,

            symbol: "XAU/USD",

            price: Number(last.close).toFixed(2),

            currentPrice: Number(last.close).toFixed(2),

            time: last.datetime,

            signal: analysis.signal,

            confidence: analysis.confidence,

            buyPercent: analysis.buyPercent,

            sellPercent: analysis.sellPercent,

            entry: analysis.entry,

            tp1: analysis.tp1,

            tp2: analysis.tp2,

            tp3: analysis.tp3,

            trend: analysis.trend,

            grade: analysis.grade,

            status: analysis.status,

            duration: analysis.duration,

            reasons: analysis.reasons,

            indicators: analysis.indicators

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

app.post("/api/close-trade", requireAuth, (req, res) => {

    activeTrade = null;

    res.json({
        success: true
    });

});

});