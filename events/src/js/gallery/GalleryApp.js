export default class GalleryApp {
    constructor(rootEl) {
        this.rootEl = rootEl;

        this.formEl = this.rootEl.querySelector('[data-id="gallery-form"]');
        this.inputEl = this.rootEl.querySelector('[data-id="gallery-input"]');
        this.errorEl = this.rootEl.querySelector('[data-id="gallery-error"]');
        this.listEl = this.rootEl.querySelector('[data-id="gallery-list"]');

        this.items = [];
        this.nextId = 1;
        this.isDestroyed = false;

        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.formEl.addEventListener('submit', this.onSubmit);
        this.rootEl.addEventListener('click', this.onClick);

        this.render();
    }

    destroy() {
        this.isDestroyed = true;

        this.formEl.removeEventListener('submit', this.onSubmit);
        this.rootEl.removeEventListener('click', this.onClick);

        this.clearError();
        this.listEl.innerHTML = '';
        this.items = [];
        this.inputEl.value = '';
    }

    onSubmit(e) {
        e.preventDefault();

        const url = this.inputEl.value.trim();
        if (!url) {
            this.showError('Введите URL изображения');
            return;
        }

        this.clearError();

        GalleryApp.validateImageUrl(url)
            .then(() => {
                if (this.isDestroyed) return;

                this.addItem(url);
                this.inputEl.value = '';
                this.render();
            })
            .catch(() => {
                if (this.isDestroyed) return;
                this.showError('Неверный URL или изображение не загрузилось');
            });
    }

    onClick(e) {
        const removeBtn = e.target.closest('[data-action="gallery-remove"]');
        if (!removeBtn) return;

        const id = Number(removeBtn.dataset.id);
        if (!Number.isFinite(id)) return;

        this.removeItem(id);
        this.render();
    }

    addItem(url) {
        this.items.unshift({ id: this.nextId, url });
        this.nextId += 1;
    }

    removeItem(id) {
        this.items = this.items.filter((x) => x.id !== id);
    }

    static validateImageUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve();
            img.onerror = () => reject();

            img.src = url;
        });
    }

    showError(text) {
        this.errorEl.textContent = text;
        this.errorEl.classList.add('is-visible');
    }

    clearError() {
        this.errorEl.textContent = '';
        this.errorEl.classList.remove('is-visible');
    }

    render() {
        this.listEl.innerHTML = '';

        this.items.forEach((item) => {
            this.listEl.append(GalleryApp.makeCard(item));
        });
    }

    static makeCard(item) {
        const li = document.createElement('li');
        li.classList.add('gallery__item');
        li.dataset.id = String(item.id);

        const img = document.createElement('img');
        img.classList.add('gallery__img');
        img.src = item.url;
        img.alt = 'image';

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('gallery__remove');
        btn.dataset.action = 'gallery-remove';
        btn.dataset.id = String(item.id);
        btn.setAttribute('aria-label', 'Remove image');
        btn.textContent = '×';

        li.append(img, btn);
        return li;
    }
}
