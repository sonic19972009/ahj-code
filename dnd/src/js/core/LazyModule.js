export default class LazyModule {
    constructor(loadFn, pageEl) {
        this.loadFn = loadFn;
        this.pageEl = pageEl;

        this.module = null;
        this.loading = null;

        this.isDestroyed = false;
    }

    init() {
        this.isDestroyed = false;

        if (this.module) {
            this.module.init();
            return;
        }

        if (this.loading) {
            return;
        }

        this.loading = this.loadFn()
            .then((Mod) => {
                if (this.isDestroyed) {
                    return null;
                }

                const ModuleClass = Mod && Mod.default ? Mod.default : Mod;

                this.module = new ModuleClass(this.pageEl);
                this.module.init();

                return this.module;
            })
            .catch(() => {});
    }

    destroy() {
        this.isDestroyed = true;

        if (!this.module) {
            return;
        }

        this.module.destroy();
    }
}
