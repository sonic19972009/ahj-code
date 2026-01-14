import initMenu from './menu';

import goblinImg from '../img/goblin.png';
import Field from './Field';
import UI from './UI';
import Game from './Game';

const FIELD_SIZE = 4;
const INTERVAL = 1000;
const MAX_MISSES = 5;

initMenu(document);

let game = null;

function createGame() {
    const gameContainer = document.getElementById('game');
    if (!gameContainer) return null;

    const goblinEl = document.createElement('img');
    goblinEl.classList.add('goblin');
    goblinEl.src = goblinImg;
    goblinEl.alt = 'goblin';

    const field = new Field(gameContainer, FIELD_SIZE);
    const ui = new UI(document);

    const instance = new Game(field, ui, goblinEl, {
        interval: INTERVAL,
        maxMisses: MAX_MISSES,
    });

    instance.init();
    return instance;
}

document.addEventListener('tabchange', (e) => {
    const { tab } = e.detail;

    if (tab === 'goblin') {
        if (!game) {
            game = createGame();
        }
        if (game) {
            game.restart();
        }
        return;
    }

    if (game) {
        game.destroy();
        game = null;
    }
});
