export default class ImageView {
    constructor(container) {
        this.container = container;
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="image" data-widget="image">
                <form class="image__form" data-id="image-form" autocomplete="off">
                    <label class="image__label">
                        Image URL
                        <input class="image__input" data-id="image-input" name="url" />
                    </label>

                    <button class="image__btn" data-id="image-submit" type="submit">
                        Add
                    </button>

                    <input
                        class="image__file"
                        data-id="image-file"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                    />

                    <button class="image__btn" data-action="image-pick" type="button">
                        Upload…
                    </button>

                    <div class="image__error" data-id="image-error"></div>
                </form>

                <div class="image__hint">
                    Можно перетащить файлы изображений из проводника прямо сюда.
                </div>

                <ul class="image__list" data-id="image-list"></ul>

                <div class="image-drop" aria-hidden="true">
                    <div class="image-drop__box">
                        <div class="image-drop__title">Drop files here</div>
                        <div class="image-drop__subtitle">Перетащите изображения (png/jpg/webp)</div>
                    </div>
                </div>
            </div>
        `;
    }

    setError(text) {
        const errorEl = this.container.querySelector('[data-id="image-error"]');
        errorEl.textContent = text;
        errorEl.classList.toggle('is-visible', Boolean(text));
    }

    clearList() {
        const listEl = this.container.querySelector('[data-id="image-list"]');
        listEl.innerHTML = '';
    }

    appendCard(item) {
        const listEl = this.container.querySelector('[data-id="image-list"]');
        listEl.append(ImageView.makeCard(item));
    }

    setInputValue(value) {
        const inputEl = this.container.querySelector('[data-id="image-input"]');
        inputEl.value = value;
    }

    focusInput() {
        const inputEl = this.container.querySelector('[data-id="image-input"]');
        inputEl.focus();
    }

    setDropActive(isActive) {
        const root = this.container.querySelector('[data-widget="image"]');
        if (!root) {
            return;
        }

        root.classList.toggle('image_drop-active', isActive);
    }

    getRefs() {
        return {
            formEl: this.container.querySelector('[data-id="image-form"]'),
            inputEl: this.container.querySelector('[data-id="image-input"]'),
            listEl: this.container.querySelector('[data-id="image-list"]'),
            fileEl: this.container.querySelector('[data-id="image-file"]'),
            pickBtnEl: this.container.querySelector('[data-action="image-pick"]'),
        };
    }

    static makeCard(item) {
        const li = document.createElement('li');
        li.className = 'image__item';
        li.dataset.id = String(item.id);

        li.innerHTML = `
            <div class="image-card">
                <div class="image-card__preview">
                    <img class="image-card__img" src="${ImageView.escape(item.url)}" alt="image" draggable="false" />
                </div>

                <div class="image-card__actions">
                    <button
                        class="image-card__remove"
                        type="button"
                        data-action="image-remove"
                        data-id="${item.id}"
                        aria-label="Remove image"
                        title="Remove"
                    >
                        ×
                    </button>
                </div>
            </div>
        `;

        return li;
    }

    static escape(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}
