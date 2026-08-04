export function entryEngine({

    liquidity,
    orderBlock,
    fvg,
    bos,
    choch,
    price

}) {

    const buyVotes = [
        liquidity.side,
        orderBlock.side,
        fvg.side
    ].filter(x => x === "BUY").length;

    const sellVotes = [
        liquidity.side,
        orderBlock.side,
        fvg.side
    ].filter(x => x === "SELL").length;

    // =========================
    // BUY
    // =========================

    if (

        buyVotes >= 2 &&

        choch.side !== "SELL"

    ) {

        return {

            signal: "BUY",

            strength: 80 + buyVotes * 5,

            entry: price,

            reasons: [

                liquidity.reason,

                orderBlock.reason,

                fvg.reason

            ].filter(Boolean)

        };

    }

    // =========================
    // SELL
    // =========================

    if (

        sellVotes >= 2 &&

        choch.side !== "BUY"

    ) {

        return {

            signal: "SELL",

            strength: 80 + sellVotes * 5,

            entry: price,

            reasons: [

                liquidity.reason,

                orderBlock.reason,

                fvg.reason

            ].filter(Boolean)

        };

    }

    // =========================
    // Early Entry
    // =========================

    if (

        liquidity.side === "BUY" &&
        bos.side === "BUY"

    ) {

        return {

            signal: "BUY",

            strength: 75,

            entry: price,

            reasons: [

                liquidity.reason,

                bos.reason

            ]

        };

    }

    if (

        liquidity.side === "SELL" &&
        bos.side === "SELL"

    ) {

        return {

            signal: "SELL",

            strength: 75,

            entry: price,

            reasons: [

                liquidity.reason,

                bos.reason

            ]

        };

    }

    return {

        signal: "WAIT",

        strength: 0,

        entry: null,

        reasons: []

    };

}