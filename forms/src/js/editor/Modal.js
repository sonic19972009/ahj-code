export default class Modal {
    constructor() {
        this.root = null;
        this.onClose = null;

        this.onBackdropClick = this.onBackdropClick.bind(this);
    }

    open({ title, body, onClose }) {
        this.onClose = onClose;

        const root = document.createElement('div');
        root.className = 'modal-backdrop';
        root.dataset.widget = 'modal-backdrop';

        root.innerHTML = `
            <div class="modal" data-widget="modal">
                <div class="modal-header">
                    <div class="modal-title" data-widget="modal-title"></div>
                    <button class="modal-close" type="button" data-action="close" aria-label="Close">✕</button>
                </div>
                <div class="modal-body" data-widget="modal-body"></div>
            </div>
        `;

        root.querySelector('[data-widget="modal-title"]').textContent = title;
        root.querySelector('[data-widget="modal-body"]').append(body);

        document.body.append(root);
        root.addEventListener('click', this.onBackdropClick);

        this.root = root;
    }

    onBackdropClick(event) {
        const closeBtn = event.target.closest('[data-action="close"]');

        if (closeBtn || event.target === this.root) {
            this.close();
        }
    }

    close() {
        if (!this.root) {
            return;
        }

        this.root.removeEventListener('click', this.onBackdropClick);
        this.root.remove();
        this.root = null;

        if (this.onClose) {
            const cb = this.onClose;
            this.onClose = null;
            cb();
        }
    }

    destroy() {
        this.close();
    }
}
