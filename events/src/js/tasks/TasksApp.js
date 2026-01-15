import Task from './Task';

export default class TasksApp {
    constructor(rootEl) {
        this.rootEl = rootEl;

        this.inputEl = this.rootEl.querySelector('[data-id="tasks-input"]');
        this.errorEl = this.rootEl.querySelector('[data-id="tasks-error"]');
        this.pinnedListEl = this.rootEl.querySelector('[data-id="tasks-pinned"]');
        this.allListEl = this.rootEl.querySelector('[data-id="tasks-all"]');

        this.tasks = [];
        this.filterText = '';
        this.nextId = 1;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onInput = this.onInput.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.inputEl.addEventListener('keydown', this.onKeyDown);
        this.inputEl.addEventListener('input', this.onInput);
        this.rootEl.addEventListener('click', this.onClick);

        this.render();
    }

    destroy() {
        this.inputEl.removeEventListener('keydown', this.onKeyDown);
        this.inputEl.removeEventListener('input', this.onInput);
        this.rootEl.removeEventListener('click', this.onClick);

        this.clearError();
    }

    onKeyDown(e) {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        const value = this.inputEl.value.trim();
        if (!value) {
            this.showError('Please enter a task name');
            return;
        }

        this.clearError();
        this.addTask(value);
        this.inputEl.value = '';
        this.filterText = '';
        this.render();
    }

    onInput() {
        this.filterText = this.inputEl.value.trim();
        this.clearError();
        this.renderAll();
    }

    onClick(e) {
        const pinBtn = e.target.closest('[data-action="toggle-pin"]');
        if (!pinBtn) return;

        const id = Number(pinBtn.dataset.id);
        const task = this.tasks.find((t) => t.id === id);
        if (!task) return;

        task.togglePinned();
        this.render();
    }

    addTask(title) {
        const task = new Task(this.nextId, title);
        this.nextId += 1;
        this.tasks.push(task);
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
        this.renderPinned();
        this.renderAll();
    }

    renderPinned() {
        const pinned = this.tasks.filter((t) => t.pinned);

        this.pinnedListEl.innerHTML = '';

        if (pinned.length === 0) {
            this.pinnedListEl.append(TasksApp.makeEmptyItem('No pinned tasks'));
            return;
        }

        pinned.forEach((task) => {
            this.pinnedListEl.append(TasksApp.makeTaskItem(task));
        });
    }

    renderAll() {
        const filter = this.filterText.toLowerCase();

        const all = this.tasks.filter((t) => !t.pinned);

        const filtered = filter
            ? all.filter((t) => t.title.toLowerCase().startsWith(filter))
            : all;

        this.allListEl.innerHTML = '';

        if (filtered.length === 0) {
            this.allListEl.append(TasksApp.makeEmptyItem('No tasks found'));
            return;
        }

        filtered.forEach((task) => {
            this.allListEl.append(TasksApp.makeTaskItem(task));
        });
    }

    static makeTaskItem(task) {
        const li = document.createElement('li');
        li.classList.add('tasks__item');
        li.dataset.taskId = String(task.id);

        const title = document.createElement('div');
        title.classList.add('tasks__title');
        title.textContent = task.title;

        const pin = document.createElement('button');
        pin.type = 'button';
        pin.classList.add('tasks__pin');
        if (task.pinned) pin.classList.add('is-active');
        pin.dataset.action = 'toggle-pin';
        pin.dataset.id = String(task.id);
        pin.setAttribute('aria-label', 'Pin/unpin task');

        li.append(title, pin);
        return li;
    }

    static makeEmptyItem(text) {
        const li = document.createElement('li');
        li.classList.add('tasks__empty');
        li.textContent = text;
        return li;
    }
}
