import ProductStore from './ProductStore.js';
import validateProduct from './validateProduct.js';
import EditorView from './EditorView.js';
import Modal from './Modal.js';

export default class EditorModule {
    constructor(container) {
        this.container = container;

        this.store = new ProductStore();
        this.view = new EditorView(container);
        this.modal = new Modal();

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.view.renderLayout();
        this.view.renderRows(this.store.list());

        this.container.addEventListener('click', this.onClick);
    }

    destroy() {
        this.container.removeEventListener('click', this.onClick);

        this.modal.destroy();
        this.view.destroy();
    }

    onClick(event) {
        const actionEl = event.target.closest('[data-action]');
        if (!actionEl) {
            return;
        }

        const action = actionEl.dataset.action;

        if (action === 'add') {
            this.openForm({ mode: 'add' });
            return;
        }

        const row = event.target.closest('tr[data-id]');
        if (!row) {
            return;
        }

        const id = Number(row.dataset.id);

        if (action === 'edit') {
            this.openForm({ mode: 'edit', id });
            return;
        }

        if (action === 'remove') {
            this.openRemoveConfirm(id);
        }
    }

    openForm({ mode, id }) {
        const product = mode === 'edit' ? this.store.getById(id) : null;

        const form = document.createElement('form');
        form.className = 'editor-form';
        form.dataset.widget = 'editor-form';

        form.innerHTML = `
            <div class="field">
                <label>Название</label>
                <input class="input" name="name" data-id="name-input" value="${product ? product.name : ''}" />
                <div class="field-error" data-error="name"></div>
            </div>

            <div class="field">
                <label>Стоимость</label>
                <input class="input" name="price" data-id="price-input" value="${product ? product.price : ''}" />
                <div class="field-error" data-error="price"></div>
            </div>

            <div class="form-actions">
                <button class="btn" type="submit" data-id="save-btn">Сохранить</button>
            </div>
        `;

        const handleSubmit = (e) => {
            e.preventDefault();

            const fd = new FormData(form);
            const result = validateProduct({
                name: fd.get('name'),
                price: fd.get('price'),
            });

            form.querySelector('[data-error="name"]').textContent = result.errors.name || '';
            form.querySelector('[data-error="price"]').textContent = result.errors.price || '';

            if (!result.isValid) {
                return;
            }

            if (mode === 'add') {
                this.store.add(result.normalized);
            } else {
                this.store.update(id, result.normalized);
            }

            this.view.renderRows(this.store.list());
            this.modal.close();
        };

        form.addEventListener('submit', handleSubmit);

        this.modal.open({
            title: mode === 'add' ? 'Добавить товар' : 'Редактировать товар',
            body: form,
            onClose: () => {
                form.removeEventListener('submit', handleSubmit);
            },
        });
    }

    openRemoveConfirm(id) {
        const product = this.store.getById(id);

        const body = document.createElement('div');
        body.dataset.widget = 'remove-confirm';

        body.innerHTML = `
            <p>Удалить товар "${product ? product.name : ''}"?</p>
            <div class="form-actions">
                <button class="btn" type="button" data-action="confirm-remove" data-id="confirm-remove-btn">Удалить</button>
                <button class="btn" type="button" data-action="cancel-remove" data-id="cancel-remove-btn">Отмена</button>
            </div>
        `;

        const onBodyClick = (e) => {
            const a = e.target.closest('[data-action]');
            if (!a) {
                return;
            }

            if (a.dataset.action === 'confirm-remove') {
                this.store.remove(id);
                this.view.renderRows(this.store.list());
                this.modal.close();
            }

            if (a.dataset.action === 'cancel-remove') {
                this.modal.close();
            }
        };

        body.addEventListener('click', onBodyClick);

        this.modal.open({
            title: 'Удаление',
            body,
            onClose: () => {
                body.removeEventListener('click', onBodyClick);
            },
        });
    }
}
