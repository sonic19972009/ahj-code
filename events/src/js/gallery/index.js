import GalleryApp from './GalleryApp';

export default class GalleryModule {
    constructor(pageEl) {
        this.pageEl = pageEl;
        this.app = new GalleryApp(this.pageEl);
    }

    init() {
        this.app.init();
    }

    destroy() {
        this.app.destroy();
    }
}
