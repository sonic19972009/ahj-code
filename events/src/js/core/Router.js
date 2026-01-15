export default class Router {
    constructor({ pagesSelector, tabsSelector, defaultPage }) {
        this.pages = Array.from(document.querySelectorAll(pagesSelector));
        this.tabs = Array.from(document.querySelectorAll(tabsSelector));

        this.defaultPage = defaultPage;

        this.modules = new Map();
        this.current = null;
        this.currentPage = null;
    }

    register(name, module) {
        this.modules.set(name, module);
    }

    start() {
        this.go(this.defaultPage);
    }

    go(pageName) {
        if (this.current && this.current.destroy) {
            this.current.destroy();
        }

        this.pages.forEach((page) => {
            page.classList.toggle(
                'is-active',
                page.dataset.page === pageName,
            );
        });

        this.tabs.forEach((tab) => {
            tab.classList.toggle(
                'is-active',
                tab.dataset.tab === pageName,
            );
        });

        const module = this.modules.get(pageName);
        if (module && module.init) {
            module.init();
        }

        this.current = module;
        this.currentPage = pageName;
    }
}
