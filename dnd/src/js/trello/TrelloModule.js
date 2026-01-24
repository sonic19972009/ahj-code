import TrelloStore from './TrelloStore';
import TrelloView from './TrelloView';
import DragController from './DragController';

export default class TrelloModule {
    constructor(pageEl) {
        this.pageEl = pageEl;

        this.rootEl = this.pageEl.querySelector('[data-widget="trello-root"]');

        this.store = new TrelloStore();
        this.view = new TrelloView(this.rootEl);

        this.dragController = null;

        this.onClick = this.onClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    init() {
        this.render();

        this.rootEl.addEventListener('click', this.onClick);
        this.rootEl.addEventListener('submit', this.onSubmit);
    }

    destroy() {
        this.unmountDnD();

        this.rootEl.removeEventListener('submit', this.onSubmit);
        this.rootEl.removeEventListener('click', this.onClick);

        this.rootEl.innerHTML = '';
    }

    render() {
        this.view.render(this.store.getState());
        this.mountDnD();
    }

    mountDnD() {
        this.unmountDnD();

        const boardEl = this.rootEl.querySelector('[data-widget="board"]');
        if (!boardEl) {
            return;
        }

        this.dragController = new DragController(boardEl, {
            onDrop: this.onDrop,
        });
        this.dragController.init();
    }

    unmountDnD() {
        if (!this.dragController) {
            return;
        }

        this.dragController.destroy();
        this.dragController = null;
    }

    onClick(e) {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) {
            return;
        }

        const { action } = actionEl.dataset;

        if (action === 'remove-card') {
            const cardEl = e.target.closest('[data-card-id]');
            if (!cardEl) {
                return;
            }

            this.store.removeCard(cardEl.dataset.cardId);
            this.render();
            return;
        }

        if (action === 'open-add') {
            const col = e.target.closest('[data-column-id]');
            if (!col) {
                return;
            }

            const form = col.querySelector('[data-role="add-form"]');
            const btn = col.querySelector('[data-action="open-add"]');
            const textarea = col.querySelector('[data-role="add-text"]');

            btn.classList.add('hidden');
            form.classList.remove('adder__form_hidden');
            textarea.focus();
            return;
        }

        if (action === 'cancel-add') {
            const col = e.target.closest('[data-column-id]');
            if (!col) {
                return;
            }

            TrelloModule.closeAdder(col);
        }
    }

    onSubmit(e) {
        const form = e.target.closest('[data-role="add-form"]');
        if (!form) {
            return;
        }

        e.preventDefault();

        const col = form.closest('[data-column-id]');
        if (!col) {
            return;
        }

        const textarea = col.querySelector('[data-role="add-text"]');
        const text = textarea.value.trim();

        if (!text) {
            textarea.focus();
            return;
        }

        this.store.addCard(col.dataset.columnId, text);
        this.render();
    }

    onDrop({
        cardId,
        fromColumnId,
        toColumnId,
        toIndex,
    }) {
        this.store.moveCard({
            cardId,
            fromColumnId,
            toColumnId,
            toIndex,
        });
        this.render();
    }

    static closeAdder(col) {
        const form = col.querySelector('[data-role="add-form"]');
        const btn = col.querySelector('[data-action="open-add"]');
        const textarea = col.querySelector('[data-role="add-text"]');

        textarea.value = '';
        form.classList.add('adder__form_hidden');
        btn.classList.remove('hidden');
    }
}
