import '../css/style.css';
import goblin from '../img/goblin.png';

const FIELD_SIZE = 4;
const INTERVAL = 1000;

const game = document.getElementById('game');
const cells = [];
const totalCells = FIELD_SIZE * FIELD_SIZE;

for (let i = 0; i < totalCells; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    game.appendChild(cell);
    cells.push(cell);
}

const img = document.createElement('img');
img.classList.add('goblin');
img.src = goblin;

let currentIndex = Math.floor(Math.random() * totalCells);
cells[currentIndex].appendChild(img);

setInterval(() => {
    let nextIndex = Math.floor(Math.random() * totalCells);

    while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * totalCells);
    }

    cells[nextIndex].appendChild(img);
    currentIndex = nextIndex;
}, INTERVAL);
