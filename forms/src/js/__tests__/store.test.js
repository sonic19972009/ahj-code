import ProductStore from '../editor/ProductStore.js';

describe('ProductStore', () => {
    test('should add product', () => {
        const store = new ProductStore();

        const p = store.add({ name: 'Apple', price: 100 });

        expect(p.id).toBe(1);
        expect(store.list()).toHaveLength(1);
        expect(store.list()[0].name).toBe('Apple');
        expect(store.list()[0].price).toBe(100);
    });

    test('should update product', () => {
        const store = new ProductStore();
        store.add({ name: 'Apple', price: 100 });

        const updated = store.update(1, { name: 'Orange', price: 200 });

        expect(updated).not.toBeNull();
        expect(store.getById(1).name).toBe('Orange');
        expect(store.getById(1).price).toBe(200);
    });

    test('should remove product', () => {
        const store = new ProductStore();
        store.add({ name: 'Apple', price: 100 });

        expect(store.remove(1)).toBe(true);
        expect(store.list()).toHaveLength(0);
    });

    test('should return null when updating missing product', () => {
        const store = new ProductStore();

        expect(store.update(999, { name: 'X', price: 1 })).toBeNull();
    });

    test('should return false when removing missing product', () => {
        const store = new ProductStore();

        expect(store.remove(999)).toBe(false);
    });
});
