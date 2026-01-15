import {
    detectCardSystem,
    isValidLuhn,
    validateCard,
    SYSTEMS,
} from '../validators';

describe('detectCardSystem', () => {
    test.each([
        ['4111111111111111', SYSTEMS.visa],
        ['5555555555554444', SYSTEMS.mastercard],
        ['2221000000000009', SYSTEMS.mastercard],
        ['378282246310005', SYSTEMS.amex],
        ['6011111111111117', SYSTEMS.discover],
        ['3530111333300000', SYSTEMS.jcb],
        ['2200000000000004', SYSTEMS.mir],
        ['6212345678901234', SYSTEMS.unionpay],
        ['6759649826438453', SYSTEMS.maestro],
    ])('should detect %s as %s', (num, expected) => {
        expect(detectCardSystem(num)).toBe(expected);
    });

    test('should return null for unknown prefix', () => {
        expect(detectCardSystem('7000000000000000')).toBeNull();
    });

    test('should return null for non-digits', () => {
        expect(detectCardSystem('4111-1111-xxxx-1111')).toBeNull();
    });
});

describe('isValidLuhn', () => {
    test.each([
        ['4111111111111111', true],
        ['5555555555554444', true],
        ['378282246310005', true],
        ['6011111111111117', true],
        ['4111111111111112', false],
        ['', false],
        ['abcd', false],
    ])('luhn(%s) -> %s', (num, expected) => {
        expect(isValidLuhn(num)).toBe(expected);
    });
});

describe('validateCard', () => {
    test('should be valid for correct system + length + luhn', () => {
        const result = validateCard('4111111111111111');
        expect(result.system).toBe(SYSTEMS.visa);
        expect(result.isValid).toBe(true);
        expect(result.lengthOk).toBe(true);
        expect(result.luhnOk).toBe(true);
    });

    test('should be invalid when luhn fails', () => {
        const result = validateCard('4111111111111112');
        expect(result.system).toBe(SYSTEMS.visa);
        expect(result.isValid).toBe(false);
        expect(result.luhnOk).toBe(false);
    });

    test('should be invalid when system is not detected', () => {
        const result = validateCard('7000000000000000');
        expect(result.system).toBeNull();
        expect(result.isValid).toBe(false);
    });

    test('should be invalid when length is not allowed for system', () => {
        const result = validateCard('3782822463100050');
        expect(result.system).toBe(SYSTEMS.amex);
        expect(result.lengthOk).toBe(false);
        expect(result.isValid).toBe(false);
    });
});
