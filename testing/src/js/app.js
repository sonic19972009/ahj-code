import CardWidget from './widget.js';

export default class App {
    constructor(root = document) {
        this.root = root;
    }

    init() {
        const form = this.root.querySelector('[data-widget="card-form-widget"]');

        if (!form) {
            return;
        }

        const widget = new CardWidget(form);
        widget.bindToDOM();
    }
}
