export default class Router {
    constructor({ pagesSelector, tabsSelector, defaultPage }) {
        this.pagesSelector = pagesSelector;
        this.tabsSelector = tabsSelector;
        this.defaultPage = defaultPage;

        this.registry = new Map();
        this.active = null;
    }

    register(name, module) {
        this.registry.set(name, module);
    }

    start() {
        this.go(this.defaultPage);
    }

    go(name) {
        if (this.active === name) {
            return;
        }

        if (this.active && this.registry.has(this.active)) {
            const prev = this.registry.get(this.active);
            if (prev && typeof prev.destroy === 'function') {
                prev.destroy();
            }
        }

        this.active = name;

        document.querySelectorAll(this.pagesSelector).forEach((el) => {
            el.classList.toggle('page_active', el.dataset.page === name);
        });

        document.querySelectorAll(this.tabsSelector).forEach((el) => {
            el.classList.toggle('tab_active', el.dataset.tab === name);
        });

        if (this.registry.has(name)) {
            const next = this.registry.get(name);
            if (next && typeof next.init === 'function') {
                next.init();
            }
        }
    }
}
