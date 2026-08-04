let lastSignal = null;

export function reentryGuard(signal, price) {

    if (signal === "WAIT") {
        return true;
    }

    if (!lastSignal) {

        lastSignal = {
            signal,
            price
        };

        return true;
    }

    // نفس الإشارة
    if (lastSignal.signal === signal) {

        const distance =
            Math.abs(price - lastSignal.price);

        // لا تعطي نفس الإشارة إذا لم يتحرك السعر
        if (distance < 2) {

            return false;

        }

    }

    lastSignal = {
        signal,
        price
    };

    return true;

}

export function resetReentry() {

    lastSignal = null;

}