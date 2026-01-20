export default class Menu {
    constructor(root, onSelect) {
        this.root = root;
        this.onSelect = onSelect;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.root.addEventListener('click', this.onClick);
    }

    destroy() {
        this.root.removeEventListener('click', this.onClick);
    }

    onClick(event) {
        const tab = event.target.closest('.tab');
        if (!tab) {
            return;
        }

        const pageName = tab.dataset.tab;
        this.onSelect(pageName);
    }
}
