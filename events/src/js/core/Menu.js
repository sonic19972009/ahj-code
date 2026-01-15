export default class Menu {
    constructor(rootEl, onSelect) {
        this.rootEl = rootEl;
        this.onSelect = onSelect;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.rootEl.addEventListener('click', this.onClick);
    }

    destroy() {
        this.rootEl.removeEventListener('click', this.onClick);
    }

    onClick(e) {
        const tab = e.target.closest('[data-tab]');
        if (!tab || !this.rootEl.contains(tab)) return;

        const pageName = tab.dataset.tab;
        this.onSelect(pageName);
    }
}
