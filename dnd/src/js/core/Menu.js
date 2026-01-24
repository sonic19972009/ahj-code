export default class Menu {
    constructor(container, onSelect) {
        this.container = container;
        this.onSelect = onSelect;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.container.addEventListener('click', this.onClick);
    }

    destroy() {
        this.container.removeEventListener('click', this.onClick);
    }

    onClick(e) {
        const btn = e.target.closest('[data-tab]');
        if (!btn) {
            return;
        }

        this.onSelect(btn.dataset.tab);
    }
}
