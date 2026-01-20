import Product from './Product.js';

export default class ProductStore {
    constructor() {
        this.items = [];
        this.nextId = 1;
    }

    list() {
        return [...this.items];
    }

    add({ name, price }) {
        const product = new Product({
            id: this.nextId,
            name,
            price,
        });

        this.nextId += 1;
        this.items.push(product);

        return product;
    }

    update(id, { name, price }) {
        const index = this.items.findIndex((p) => p.id === id);
        if (index === -1) {
            return null;
        }

        const updated = new Product({ id, name, price });
        this.items[index] = updated;

        return updated;
    }

    remove(id) {
        const index = this.items.findIndex((p) => p.id === id);
        if (index === -1) {
            return false;
        }

        this.items.splice(index, 1);
        return true;
    }

    getById(id) {
        return this.items.find((p) => p.id === id) || null;
    }
}
