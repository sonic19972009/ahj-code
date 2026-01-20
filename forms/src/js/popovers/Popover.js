export default class Popover {
    constructor({ title, content }) {
        this.title = title;
        this.content = content;

        this.element = null;
    }

    render() {
        const popover = document.createElement('div');
        popover.className = 'popover';
        popover.dataset.widget = 'popover';

        const titleEl = document.createElement('div');
        titleEl.className = 'popover-title';
        titleEl.textContent = this.title;

        const contentEl = document.createElement('div');
        contentEl.className = 'popover-content';
        contentEl.textContent = this.content;

        popover.append(titleEl);
        popover.append(contentEl);

        this.element = popover;
        return popover;
    }

    destroy() {
        if (this.element) {
            this.element.remove();
            this.element = null;
        }
    }
}
