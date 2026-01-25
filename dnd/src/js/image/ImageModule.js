import ImageApp from './ImageApp';

export default class ImageModule {
    constructor(pageEl) {
        this.pageEl = pageEl;
        this.rootEl = this.pageEl.querySelector('[data-widget="image-root"]');

        this.app = null;
    }

    init() {
        this.app = new ImageApp(this.rootEl);
        this.app.init();
    }

    destroy() {
        if (!this.app) {
            return;
        }

        this.app.destroy();
        this.app = null;

        this.rootEl.innerHTML = '';
    }
}
