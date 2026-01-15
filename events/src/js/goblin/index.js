import goblinImgSrc from '../../img/goblin.png';

import Field from './Field';
import UI from './UI';
import Game from './Game';

export default class GoblinModule {
    constructor(pageEl) {
        this.pageEl = pageEl;

        this.gameRoot = this.pageEl.querySelector('#game');

        this.goblinImg = document.createElement('img');
        this.goblinImg.classList.add('goblin');
        this.goblinImg.src = goblinImgSrc;
        this.goblinImg.alt = 'goblin';

        this.field = new Field(this.gameRoot, 4);
        this.ui = new UI(this.pageEl);

        this.game = new Game(this.field, this.ui, this.goblinImg, {
            interval: 1000,
            maxMisses: 5,
        });
    }

    init() {
        this.game.start();
    }

    destroy() {
        this.game.destroy();
    }
}
