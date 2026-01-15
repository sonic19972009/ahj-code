export function isValidInn(value) {
    return typeof value === 'string' && value.length > 0;
}

export const SYSTEMS = Object.freeze({
    visa: 'visa',
    mastercard: 'mastercard',
    amex: 'amex',
    discover: 'discover',
    jcb: 'jcb',
    mir: 'mir',
    unionpay: 'unionpay',
    maestro: 'maestro',
});

export function normalizeCardNumber(value) {
    return String(value).replace(/\s+/g, '').replace(/-/g, '');
}

function isDigitsOnly(value) {
    return /^\d+$/.test(value);
}

function inRange(num, from, to) {
    return num >= from && num <= to;
}

export function detectCardSystem(value) {
    const num = normalizeCardNumber(value);

    if (!num || !isDigitsOnly(num)) {
        return null;
    }

    const p1 = Number(num.slice(0, 1));
    const p2 = Number(num.slice(0, 2));
    const p3 = Number(num.slice(0, 3));
    const p4 = Number(num.slice(0, 4));
    const p6 = Number(num.slice(0, 6));

    if (p1 === 4) {
        return SYSTEMS.visa;
    }

    if (inRange(p2, 51, 55) || inRange(p4, 2221, 2720)) {
        return SYSTEMS.mastercard;
    }

    if (p2 === 34 || p2 === 37) {
        return SYSTEMS.amex;
    }

    if (p4 === 6011 || p2 === 65 || inRange(p3, 644, 649) || inRange(p6, 622126, 622925)) {
        return SYSTEMS.discover;
    }

    if (inRange(p4, 3528, 3589)) {
        return SYSTEMS.jcb;
    }

    if (inRange(p4, 2200, 2204)) {
        return SYSTEMS.mir;
    }

    if (p2 === 62) {
        return SYSTEMS.unionpay;
    }

    if (p2 === 50 || inRange(p2, 56, 69)) {
        return SYSTEMS.maestro;
    }

    return null;
}

export function isValidLuhn(value) {
    const num = normalizeCardNumber(value);

    if (!num || !isDigitsOnly(num)) {
        return false;
    }

    let sum = 0;
    let shouldDouble = false;

    for (let i = num.length - 1; i >= 0; i -= 1) {
        let digit = Number(num[i]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

const SYSTEM_LENGTHS = Object.freeze({
    [SYSTEMS.visa]: new Set([13, 16, 19]),
    [SYSTEMS.mastercard]: new Set([16]),
    [SYSTEMS.amex]: new Set([15]),
    [SYSTEMS.discover]: new Set([16, 19]),
    [SYSTEMS.jcb]: new Set([16]),
    [SYSTEMS.mir]: new Set([16]),
    [SYSTEMS.unionpay]: new Set([16, 17, 18, 19]),
    [SYSTEMS.maestro]: new Set([12, 13, 14, 15, 16, 17, 18, 19]),
});

export function isValidByLength(value, system = null) {
    const num = normalizeCardNumber(value);

    if (!num || !isDigitsOnly(num)) {
        return false;
    }

    const length = num.length;

    if (!system) {
        return length >= 12 && length <= 19;
    }

    const allowed = SYSTEM_LENGTHS[system];

    if (!allowed) {
        return false;
    }

    return allowed.has(length);
}

export function validateCard(value) {
    const system = detectCardSystem(value);
    const lengthOk = isValidByLength(value, system);
    const luhnOk = isValidLuhn(value);

    return {
        system,
        isValid: Boolean(system) && lengthOk && luhnOk,
        lengthOk,
        luhnOk,
    };
}
