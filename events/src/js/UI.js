export default class UI {
    constructor(root = document) {
        this.root = root;

        this.scoreEl = root.querySelector('[data-id=score]');
        this.missesEl = root.querySelector('[data-id=misses]');
        this.messageEl = root.querySelector('[data-id=message]');
        this.restartBtn = root.querySelector('[data-action=restart]');

        this.restartHandler = null;
    }

    setScore(value) {
        this.scoreEl.textContent = String(value);
    }

    setMisses(value) {
        this.missesEl.textContent = String(value);
    }

    setMessage(text) {
        this.messageEl.textContent = text || '';
    }

    onRestart(handler) {
        this.offRestart();
        this.restartHandler = handler;
        this.restartBtn.addEventListener('click', this.restartHandler);
    }

    offRestart() {
        if (this.restartHandler) {
            this.restartBtn.removeEventListener('click', this.restartHandler);
            this.restartHandler = null;
        }
    }

    destroy() {
        this.offRestart();
    }
}
