export default class Field {
    constructor(container, size) {
        this.container = container;
        this.size = size;
        this.cells = [];
    }

    init() {
        const total = this.size * this.size;

        this.container.innerHTML = '';
        this.cells = [];

        for (let i = 0; i < total; i += 1) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = String(i);

            this.container.append(cell);
            this.cells.push(cell);
        }
    }

    destroy() {
        this.container.innerHTML = '';
        this.cells = [];
    }

    randomIndex(excludeIndex) {
        let index = Math.floor(Math.random() * this.cells.length);

        while (index === excludeIndex) {
            index = Math.floor(Math.random() * this.cells.length);
        }

        return index;
    }

    placeGoblin(index, goblinEl) {
        this.cells[index].append(goblinEl);
    }

    static removeGoblin(goblinEl) {
        if (goblinEl && goblinEl.parentElement) {
            goblinEl.remove();
        }
    }
}
