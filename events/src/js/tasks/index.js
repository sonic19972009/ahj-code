import TasksApp from './TasksApp';

export default class TasksModule {
    constructor(pageEl) {
        this.pageEl = pageEl;
        this.app = new TasksApp(this.pageEl);
    }

    init() {
        this.app.init();
    }

    destroy() {
        this.app.destroy();
    }
}
