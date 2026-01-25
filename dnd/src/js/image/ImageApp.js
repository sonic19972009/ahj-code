import ImageView from './ImageView';
import ImageStore from './ImageStore';
import ImageDragController from './ImageDragController';

export default class ImageApp {
    constructor(rootEl) {
        this.rootEl = rootEl;

        this.view = new ImageView(this.rootEl);
        this.store = ImageStore;

        this.items = [];
        this.nextId = 1;

        this.drag = null;

        this.isDestroyed = false;
        this.dropDepth = 0;

        this.onSubmit = this.onSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onDrop = this.onDrop.bind(this);

        this.onFileChange = this.onFileChange.bind(this);

        this.onWindowDragEnter = this.onWindowDragEnter.bind(this);
        this.onWindowDragLeave = this.onWindowDragLeave.bind(this);
        this.onWindowDrop = this.onWindowDrop.bind(this);
    }

    init() {
        this.view.renderLayout();

        const {
            formEl,
            listEl,
            fileEl,
        } = this.view.getRefs();

        this.items = this.store.load();
        this.nextId = ImageApp.calcNextId(this.items);

        formEl.addEventListener('submit', this.onSubmit);
        this.rootEl.addEventListener('click', this.onClick);
        fileEl.addEventListener('change', this.onFileChange);

        window.addEventListener('dragenter', this.onWindowDragEnter);
        window.addEventListener('dragleave', this.onWindowDragLeave);
        window.addEventListener('dragover', ImageApp.onWindowDragOver);
        window.addEventListener('drop', this.onWindowDrop);

        this.drag = new ImageDragController(listEl, { onDrop: this.onDrop });
        this.drag.init();

        this.render();
    }

    destroy() {
        this.isDestroyed = true;

        const { formEl, fileEl } = this.view.getRefs();

        formEl.removeEventListener('submit', this.onSubmit);
        this.rootEl.removeEventListener('click', this.onClick);
        fileEl.removeEventListener('change', this.onFileChange);

        window.removeEventListener('dragenter', this.onWindowDragEnter);
        window.removeEventListener('dragleave', this.onWindowDragLeave);
        window.removeEventListener('dragover', ImageApp.onWindowDragOver);
        window.removeEventListener('drop', this.onWindowDrop);

        if (this.drag) {
            this.drag.destroy();
            this.drag = null;
        }

        this.items = [];
        this.view.setDropActive(false);
        this.view.setError('');
        this.view.clearList();
        this.view.setInputValue('');
    }

    onSubmit(e) {
        e.preventDefault();

        const { inputEl } = this.view.getRefs();

        const url = inputEl.value.trim();
        if (!url) {
            this.view.setError('Введите URL изображения');
            return;
        }

        this.view.setError('');

        ImageApp.validateImageUrl(url)
            .then(() => {
                if (this.isDestroyed) {
                    return;
                }

                this.addItem(url);
                this.store.save(this.items);

                this.view.setInputValue('');
                this.render();
            })
            .catch(() => {
                if (this.isDestroyed) {
                    return;
                }

                this.view.setError('Неверный URL или изображение не загрузилось');
            });
    }

    onClick(e) {
        const removeBtn = e.target.closest('[data-action="image-remove"]');
        if (removeBtn) {
            const id = Number(removeBtn.dataset.id);
            if (!Number.isFinite(id)) {
                return;
            }

            this.items = this.items.filter((x) => x.id !== id);
            this.store.save(this.items);
            this.render();
            return;
        }

        const pickBtn = e.target.closest('[data-action="image-pick"]');
        if (!pickBtn) {
            return;
        }

        const { fileEl } = this.view.getRefs();
        fileEl.click();
    }

    onFileChange(e) {
        const files = Array.from(e.target.files || []);
        if (!files.length) {
            return;
        }

        this.view.setError('');

        const images = files.filter((f) => f.type && f.type.startsWith('image/'));
        if (!images.length) {
            this.view.setError('Можно загружать только изображения');
            e.target.value = '';
            return;
        }

        images.forEach((file) => {
            ImageApp.readFileAsDataUrl(file)
                .then((url) => {
                    if (this.isDestroyed) {
                        return;
                    }

                    this.addItem(url);
                    this.store.save(this.items);
                    this.render();
                })
                .catch(() => {
                    if (this.isDestroyed) {
                        return;
                    }
                    this.view.setError('Не удалось прочитать файл');
                });
        });

        e.target.value = '';
    }

    onDrop({ id, beforeId, placeholder }) {
        if (placeholder && placeholder.parentNode) {
            placeholder.remove();
        }

        this.reorder(id, beforeId);
        this.store.save(this.items);
        this.render();
    }

    onWindowDragEnter(e) {
        if (!ImageApp.hasFiles(e)) {
            return;
        }

        this.dropDepth += 1;
        this.view.setDropActive(true);
    }

    onWindowDragLeave(e) {
        if (!ImageApp.hasFiles(e)) {
            return;
        }

        this.dropDepth -= 1;
        if (this.dropDepth <= 0) {
            this.dropDepth = 0;
            this.view.setDropActive(false);
        }
    }

    onWindowDrop(e) {
        e.preventDefault();

        this.dropDepth = 0;
        this.view.setDropActive(false);

        const files = Array.from(e.dataTransfer.files || []);
        if (!files.length) {
            return;
        }

        const images = files.filter((f) => f.type && f.type.startsWith('image/'));
        if (!images.length) {
            this.view.setError('Можно перетаскивать только изображения');
            return;
        }

        this.view.setError('');

        images.forEach((file) => {
            ImageApp.readFileAsDataUrl(file)
                .then((url) => {
                    if (this.isDestroyed) {
                        return;
                    }

                    this.addItem(url);
                    this.store.save(this.items);
                    this.render();
                })
                .catch(() => {
                    if (this.isDestroyed) {
                        return;
                    }
                    this.view.setError('Не удалось прочитать файл');
                });
        });
    }

    addItem(url) {
        this.items.unshift({ id: this.nextId, url });
        this.nextId += 1;
    }

    reorder(id, beforeId) {
        const fromIndex = this.items.findIndex((x) => x.id === id);
        if (fromIndex === -1) {
            return;
        }

        const [moved] = this.items.splice(fromIndex, 1);

        if (beforeId === null) {
            this.items.push(moved);
            return;
        }

        const toIndex = this.items.findIndex((x) => x.id === beforeId);
        if (toIndex === -1) {
            this.items.push(moved);
            return;
        }

        this.items.splice(toIndex, 0, moved);
    }

    render() {
        this.view.clearList();
        this.items.forEach((item) => this.view.appendCard(item));
    }

    static calcNextId(items) {
        const maxId = items.reduce((acc, x) => Math.max(acc, x.id), 0);
        return maxId + 1;
    }

    static readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error('FileReader error'));

            reader.readAsDataURL(file);
        });
    }

    static onWindowDragOver(e) {
        e.preventDefault();
    }

    static hasFiles(e) {
        const types = Array.from((e.dataTransfer && e.dataTransfer.types) || []);
        return types.includes('Files');
    }

    static validateImageUrl(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Image load error'));

            img.src = url;
        });
    }
}
