export default class LazyModule {
    constructor(loader, container) {
        this.loader = loader;
        this.container = container;

        this.instance = null;

        this.isActive = false;
        this.loadPromise = null;
    }

    init() {
        this.isActive = true;

        if (this.instance) {
            this.instance.init();
            return;
        }

        if (!this.loadPromise) {
            this.loadPromise = this.loader();
        }

        this.loadPromise
            .then((mod) => {
                if (!this.isActive) {
                    return;
                }

                const ModuleClass = mod.default;
                this.instance = new ModuleClass(this.container);
                this.instance.init();
            })
            .catch((e) => {
                if (!this.isActive) {
                    return;
                }

                this.container.innerHTML = `<p style="color:#b00020;">Ошибка загрузки модуля: ${String(e)}</p>`;
            });
    }

    destroy() {
        this.isActive = false;

        if (this.instance) {
            this.instance.destroy();
        }
    }
}
