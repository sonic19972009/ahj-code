import DownloadApp from './DownloadApp';

export default class DownloadModule {
    constructor(pageEl) {
        this.pageEl = pageEl;
        this.rootEl = this.pageEl.querySelector('[data-widget="download-root"]');
        this.app = null;
    }

    init() {
        this.app = new DownloadApp(this.rootEl);
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
