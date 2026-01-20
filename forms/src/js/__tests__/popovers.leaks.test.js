import PopoversModule from '../popovers/PopoversModule';

describe('PopoversModule memory leaks', () => {
    test('should remove document/window listeners on destroy', () => {
        document.body.innerHTML = '<div data-page="popovers"></div>';

        const container = document.querySelector('[data-page="popovers"]');

        const added = new Set();
        const removed = new Set();

        const docAdd = document.addEventListener.bind(document);
        const docRemove = document.removeEventListener.bind(document);

        const winAdd = window.addEventListener.bind(window);
        const winRemove = window.removeEventListener.bind(window);

        document.addEventListener = (type, handler, options) => {
            if (type === 'click') {
                added.add(`doc:${type}:${handler}`);
            }
            return docAdd(type, handler, options);
        };

        document.removeEventListener = (type, handler, options) => {
            if (type === 'click') {
                removed.add(`doc:${type}:${handler}`);
            }
            return docRemove(type, handler, options);
        };

        window.addEventListener = (type, handler, options) => {
            if (type === 'resize') {
                added.add(`win:${type}:${handler}`);
            }
            return winAdd(type, handler, options);
        };

        window.removeEventListener = (type, handler, options) => {
            if (type === 'resize') {
                removed.add(`win:${type}:${handler}`);
            }
            return winRemove(type, handler, options);
        };

        try {
            const module = new PopoversModule(container);
            module.init();

            const button = container.querySelector('[data-widget="popover-trigger"]');

            button.click();

            expect(Array.from(added).some((k) => k.startsWith('doc:click:'))).toBe(true);
            expect(Array.from(added).some((k) => k.startsWith('win:resize:'))).toBe(true);

            module.destroy();

            expect(Array.from(removed).some((k) => k.startsWith('doc:click:'))).toBe(true);
            expect(Array.from(removed).some((k) => k.startsWith('win:resize:'))).toBe(true);

            expect(document.querySelector('[data-widget="popover"]')).toBeNull();
        } finally {
            document.addEventListener = docAdd;
            document.removeEventListener = docRemove;

            window.addEventListener = winAdd;
            window.removeEventListener = winRemove;
        }
    });
});
