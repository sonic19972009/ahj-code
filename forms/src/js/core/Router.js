export default class Router {
    constructor({ pagesSelector, tabsSelector, defaultPage }) {
        this.pagesSelector = pagesSelector;
        this.tabsSelector = tabsSelector;
        this.defaultPage = defaultPage;

        this.pages = null;
        this.tabs = null;

        this.registry = new Map();
        this.activeModule = null;
    }

    register(name, module) {
        this.registry.set(name, module);
    }

    start() {
        this.pages = Array.from(document.querySelectorAll(this.pagesSelector));
        this.tabs = Array.from(document.querySelectorAll(this.tabsSelector));

        this.go(this.defaultPage);
    }

    go(name) {
        if (this.activeModule && typeof this.activeModule.destroy === 'function') {
            this.activeModule.destroy();
        }

        this.activeModule = null;

        this.pages.forEach((page) => {
            page.classList.toggle('hidden', page.dataset.page !== name);
        });

        this.tabs.forEach((tab) => {
            tab.classList.toggle('active', tab.dataset.tab === name);
        });

        const module = this.registry.get(name);
        if (module && typeof module.init === 'function') {
            module.init();
            this.activeModule = module;
        }
    }
}
