export function confidenceEngine({

    ema,
    rsi,
    macd,
    bos,
    choch,
    orderBlock,
    fvg,
    liquidity

}) {

    let confidence = 50;

    const reasons = [];

    // =====================
    // BOS
    // =====================

    if (bos.side !== "WAIT") {

        confidence += 8;
        reasons.push(bos.reason);

    }

    // =====================
    // CHoCH
    // =====================

    if (choch.side !== "WAIT") {

        confidence += 10;
        reasons.push(choch.reason);

    }

    // =====================
    // EMA
    // =====================

    if (ema.side !== "WAIT") {

        confidence += 6;
        reasons.push(ema.reason);

    }

    // =====================
    // MACD
    // =====================

    if (macd.side !== "WAIT") {

        confidence += 6;
        reasons.push(macd.reason);

    }

    // =====================
    // RSI
    // =====================

    if (rsi.side !== "WAIT") {

        confidence += 5;
        reasons.push(rsi.reason);

    }

    // =====================
    // Order Block
    // =====================

    if (orderBlock.side !== "WAIT") {

        confidence += 8;
        reasons.push(orderBlock.reason);

    }

    // =====================
    // FVG
    // =====================

    if (fvg.side !== "WAIT") {

        confidence += 8;
        reasons.push(fvg.reason);

    }

    // =====================
    // Liquidity
    // =====================

    if (liquidity.side !== "WAIT") {

        confidence += 9;
        reasons.push(liquidity.reason);

    }

    confidence = Math.min(confidence, 99);

    return {

        confidence,

        reasons

    };

}