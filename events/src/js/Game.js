export default class Game {
    constructor(field, ui, goblinEl, options) {
        this.field = field;
        this.ui = ui;
        this.goblinEl = goblinEl;

        this.interval = options.interval;
        this.maxMisses = options.maxMisses;

        this.timerId = null;
        this.currentIndex = -1;
        this.hitThisTurn = false;

        this.score = 0;
        this.misses = 0;

        this.onClick = this.onClick.bind(this);
        this.tick = this.tick.bind(this);
        this.onRestartClick = this.onRestartClick.bind(this);

        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        this.field.init();
        this.field.container.addEventListener('click', this.onClick);
        this.ui.onRestart(this.onRestartClick);

        this.ui.setScore(0);
        this.ui.setMisses(0);
        this.ui.setMessage('');

        this.isInitialized = true;
    }

    start() {
        if (!this.isInitialized) this.init();
        if (this.timerId) return;

        this.spawn();
        this.timerId = setInterval(this.tick, this.interval);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }

        this.field.removeGoblin(this.goblinEl);
        this.currentIndex = -1;
        this.hitThisTurn = false;
    }

    restart() {
        this.stop();

        this.score = 0;
        this.misses = 0;
        this.currentIndex = -1;
        this.hitThisTurn = false;

        this.ui.setScore(this.score);
        this.ui.setMisses(this.misses);
        this.ui.setMessage('');

        this.start();
    }

    destroy() {
        this.stop();

        if (this.isInitialized) {
            this.field.container.removeEventListener('click', this.onClick);
            this.ui.destroy();
            this.field.destroy();
        }

        this.isInitialized = false;
    }

    gameOver() {
        this.stop();
        this.ui.setMessage('Game Over 😈');
    }

    tick() {
        if (this.currentIndex !== -1 && !this.hitThisTurn) {
            this.misses += 1;
            this.ui.setMisses(this.misses);

            if (this.misses >= this.maxMisses) {
                this.gameOver();
                return;
            }
        }

        this.spawn();
    }

    spawn() {
        this.hitThisTurn = false;

        const nextIndex = this.field.randomIndex(this.currentIndex);
        this.currentIndex = nextIndex;

        this.field.removeGoblin(this.goblinEl);
        this.field.placeGoblin(this.currentIndex, this.goblinEl);
    }

    onClick(e) {
        if (!this.timerId) return;

        const { target } = e;
        if (!target || !target.classList || !target.classList.contains('goblin')) return;

        if (this.hitThisTurn) return;

        this.hitThisTurn = true;
        this.score += 1;
        this.ui.setScore(this.score);
        this.field.removeGoblin(this.goblinEl);
        this.currentIndex = -1;
    }

    onRestartClick() {
        this.restart();
    }
}
