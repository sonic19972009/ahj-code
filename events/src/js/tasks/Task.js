export default class Task {
    constructor(id, title) {
        this.id = id;
        this.title = title;
        this.pinned = false;
    }

    togglePinned() {
        this.pinned = !this.pinned;
    }
}
