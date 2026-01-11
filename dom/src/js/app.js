import '../css/style.css';
import goblin from '../img/goblin.png';

// Game part

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

// Table part

const movies = [
    {
        id: 26,
        title: 'Побег из Шоушенка',
        imdb: 9.30,
        year: 1994,
    },
    {
        id: 25,
        title: 'Крёстный отец',
        imdb: 9.20,
        year: 1972,
    },
    {
        id: 27,
        title: 'Крёстный отец 2',
        imdb: 9.00,
        year: 1974,
    },
    {
        id: 1047,
        title: 'Тёмный рыцарь',
        imdb: 9.00,
        year: 2008,
    },
    {
        id: 223,
        title: 'Криминальное чтиво',
        imdb: 8.90,
        year: 1994,
    },
];

const tableRoot = document.getElementById('movie-table');

const formatImdb = (value) => Number(value).toFixed(2);

const createTable = () => {
    const table = document.createElement('table');
    table.classList.add('table');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'year', label: 'Year' },
        { key: 'imdb', label: 'IMDB' },
    ];

    headers.forEach((h) => {
        const th = document.createElement('th');
        th.dataset.key = h.key;
        th.textContent = h.label;

        const arrow = document.createElement('span');
        arrow.classList.add('sort-arrow');
        arrow.textContent = '';
        th.appendChild(arrow);

        headRow.appendChild(th);
    });

    thead.appendChild(headRow);

    const tbody = document.createElement('tbody');

    movies.forEach((movie) => {
        const tr = document.createElement('tr');
        tr.dataset.id = String(movie.id);
        tr.dataset.title = movie.title;
        tr.dataset.year = String(movie.year);
        tr.dataset.imdb = formatImdb(movie.imdb);

        const tdId = document.createElement('td');
        tdId.textContent = `#${movie.id}`;

        const tdTitle = document.createElement('td');
        tdTitle.textContent = movie.title;

        const tdYear = document.createElement('td');
        tdYear.textContent = `(${movie.year})`;

        const tdImdb = document.createElement('td');
        tdImdb.textContent = `imdb: ${formatImdb(movie.imdb)}`;

        tr.appendChild(tdId);
        tr.appendChild(tdTitle);
        tr.appendChild(tdYear);
        tr.appendChild(tdImdb);

        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
};

const table = createTable();
tableRoot.appendChild(table);

const tbody = table.querySelector('tbody');
const headerCells = Array.from(table.querySelectorAll('thead th'));

const setArrow = (key, direction) => {
    headerCells.forEach((th) => {
        const arrow = th.querySelector('.sort-arrow');
        if (!arrow) return;

        if (th.dataset.key === key) {
            arrow.textContent = direction === 'asc' ? '▲' : '▼';
        } else {
            arrow.textContent = '';
        }
    });
};

const compare = (a, b, key, direction) => {
    const va = a.dataset[key];
    const vb = b.dataset[key];

    let result = 0;

    if (key === 'title') {
        result = va.localeCompare(vb, 'ru');
    } else {
        result = Number(va) - Number(vb);
    }

    return direction === 'asc' ? result : -result;
};

const sortSteps = [
    { key: 'id', direction: 'asc' },
    { key: 'id', direction: 'desc' },
    { key: 'title', direction: 'asc' },
    { key: 'title', direction: 'desc' },
    { key: 'year', direction: 'asc' },
    { key: 'year', direction: 'desc' },
    { key: 'imdb', direction: 'asc' },
    { key: 'imdb', direction: 'desc' },
];

let stepIndex = 0;

setInterval(() => {
    const { key, direction } = sortSteps[stepIndex];

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => compare(a, b, key, direction));

    rows.forEach((row) => {
        tbody.appendChild(row);
    });

    setArrow(key, direction);

    stepIndex += 1;
    if (stepIndex >= sortSteps.length) {
        stepIndex = 0;
    }
}, 2000);

// In-Memory Sorting

const memoryMoviesData = [
    {
        id: 26,
        title: 'Побег из Шоушенка',
        imdb: 9.30,
        year: 1994,
    },
    {
        id: 25,
        title: 'Крёстный отец',
        imdb: 9.20,
        year: 1972,
    },
    {
        id: 27,
        title: 'Крёстный отец 2',
        imdb: 9.00,
        year: 1974,
    },
    {
        id: 1047,
        title: 'Тёмный рыцарь',
        imdb: 9.00,
        year: 2008,
    },
    {
        id: 223,
        title: 'Криминальное чтиво',
        imdb: 8.90,
        year: 1994,
    },
];

const memorySortSteps = [
    { key: 'id', direction: 'asc' },
    { key: 'id', direction: 'desc' },
    { key: 'title', direction: 'asc' },
    { key: 'title', direction: 'desc' },
    { key: 'year', direction: 'asc' },
    { key: 'year', direction: 'desc' },
    { key: 'imdb', direction: 'asc' },
    { key: 'imdb', direction: 'desc' },
];

const formatMemoryImdb = (value) => Number(value).toFixed(2);

const compareMemory = (a, b, key, direction) => {
    let result = 0;

    if (key === 'title') {
        result = a.title.localeCompare(b.title, 'ru');
    } else {
        result = Number(a[key]) - Number(b[key]);
    }

    return direction === 'asc' ? result : -result;
};

const memoryRoot = document.getElementById('movie-table-memory');

if (memoryRoot) {
    const memoryTable = document.createElement('table');
    memoryTable.classList.add('table');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'year', label: 'Year' },
        { key: 'imdb', label: 'IMDB' },
    ];

    headers.forEach((h) => {
        const th = document.createElement('th');
        th.dataset.key = h.key;
        th.textContent = h.label;

        const arrow = document.createElement('span');
        arrow.classList.add('sort-arrow');
        arrow.textContent = '';
        th.appendChild(arrow);

        headRow.appendChild(th);
    });

    thead.appendChild(headRow);

    const memoryTbody = document.createElement('tbody');

    memoryTable.appendChild(thead);
    memoryTable.appendChild(memoryTbody);
    memoryRoot.appendChild(memoryTable);

    const setMemoryArrow = (key, direction) => {
        const ths = Array.from(memoryTable.querySelectorAll('thead th'));
        ths.forEach((th) => {
            const arrow = th.querySelector('.sort-arrow');
            if (!arrow) return;

            if (th.dataset.key === key) {
                arrow.textContent = direction === 'asc' ? '▲' : '▼';
            } else {
                arrow.textContent = '';
            }
        });
    };

    let memoryMovies = memoryMoviesData.map((m) => ({ ...m }));

    const renderMemory = () => {
        memoryTbody.innerHTML = '';

        memoryMovies.forEach((movie) => {
            const tr = document.createElement('tr');

            tr.dataset.id = String(movie.id);
            tr.dataset.title = movie.title;
            tr.dataset.year = String(movie.year);
            tr.dataset.imdb = formatMemoryImdb(movie.imdb);

            const tdId = document.createElement('td');
            tdId.textContent = `#${movie.id}`;

            const tdTitle = document.createElement('td');
            tdTitle.textContent = movie.title;

            const tdYear = document.createElement('td');
            tdYear.textContent = `(${movie.year})`;

            const tdImdb = document.createElement('td');
            tdImdb.textContent = `imdb: ${formatMemoryImdb(movie.imdb)}`;

            tr.appendChild(tdId);
            tr.appendChild(tdTitle);
            tr.appendChild(tdYear);
            tr.appendChild(tdImdb);

            memoryTbody.appendChild(tr);
        });
    };

    renderMemory();

    let memoryStepIndex = 0;

    setInterval(() => {
        const { key, direction } = memorySortSteps[memoryStepIndex];

        memoryMovies = [...memoryMovies].sort((a, b) => compareMemory(a, b, key, direction));

        renderMemory();
        setMemoryArrow(key, direction);

        memoryStepIndex += 1;
        if (memoryStepIndex >= memorySortSteps.length) {
            memoryStepIndex = 0;
        }
    }, 2000);
}
