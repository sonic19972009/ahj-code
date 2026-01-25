const STORAGE_KEY = 'ahj-dnd-image-state';

export default class ImageStore {
    static load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed
                .filter((x) => x && typeof x === 'object')
                .filter((x) => typeof x.id === 'number' && typeof x.url === 'string');
        } catch (e) {
            return [];
        }
    }

    static save(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
}
