let activeTrade = null;

export function getActiveTrade() {
    return activeTrade;
}

export function hasActiveTrade() {
    return activeTrade !== null;
}

export function openTrade(trade) {
    activeTrade = {
        ...trade,
        openedAt: Date.now(),
        status: "ACTIVE"
    };
}

export function updateCurrentPrice(price) {
    if (!activeTrade) return;

    activeTrade.currentPrice = price;
}

export function closeTrade() {
    activeTrade = null;
}