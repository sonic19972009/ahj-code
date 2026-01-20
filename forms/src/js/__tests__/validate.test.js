import validateProduct from '../editor/validateProduct.js';

describe('validateProduct', () => {
    test('should fail when name is empty', () => {
        const result = validateProduct({ name: '   ', price: 10 });

        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBeTruthy();
    });

    test('should fail when price is not a number', () => {
        const result = validateProduct({ name: 'Apple', price: 'abc' });

        expect(result.isValid).toBe(false);
        expect(result.errors.price).toBeTruthy();
    });

    test('should fail when price <= 0', () => {
        const result = validateProduct({ name: 'Apple', price: 0 });

        expect(result.isValid).toBe(false);
        expect(result.errors.price).toBeTruthy();
    });

    test('should normalize valid data', () => {
        const result = validateProduct({ name: '  Apple ', price: '100' });

        expect(result.isValid).toBe(true);
        expect(result.normalized).toEqual({ name: 'Apple', price: 100 });
    });
});
