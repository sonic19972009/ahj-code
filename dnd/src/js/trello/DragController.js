export default class DragController {
    constructor(boardEl, { onDrop }) {
        this.boardEl = boardEl;
        this.onDrop = onDrop;

        this.drag = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    init() {
        this.boardEl.addEventListener('mousedown', this.onMouseDown);
    }

    destroy() {
        this.boardEl.removeEventListener('mousedown', this.onMouseDown);
        this.detachDocumentListeners();
        this.cleanupDrag();
    }

    onMouseDown(e) {
        if (e.button !== 0) {
            return;
        }

        const cardEl = e.target.closest('.card');
        if (!cardEl || !this.boardEl.contains(cardEl)) {
            return;
        }

        if (e.target.closest('[data-action="remove-card"]')) {
            return;
        }

        e.preventDefault();

        const fromColumnEl = cardEl.closest('[data-column-id]');
        if (!fromColumnEl) {
            return;
        }

        const rect = cardEl.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        placeholder.style.height = `${rect.height}px`;

        cardEl.replaceWith(placeholder);

        const ghost = cardEl.cloneNode(true);
        ghost.classList.add('ghost');
        ghost.style.width = `${rect.width}px`;

        document.body.append(ghost);

        this.drag = {
            cardId: cardEl.dataset.cardId,
            fromColumnId: fromColumnEl.dataset.columnId,
            placeholder,
            ghost,
            shiftX,
            shiftY,
        };

        document.body.classList.add('is-grabbing');
        document.documentElement.classList.add('is-grabbing');

        this.moveGhost(e.pageX, e.pageY);
        this.attachDocumentListeners();
    }

    onMouseMove(e) {
        if (!this.drag) {
            return;
        }

        this.moveGhost(e.pageX, e.pageY);

        const elem = document.elementFromPoint(e.clientX, e.clientY);
        if (!elem) {
            return;
        }

        const columnEl = elem.closest('[data-column-id]');
        if (!columnEl) {
            return;
        }

        const cardsEl = columnEl.querySelector('[data-role="cards"]');
        if (!cardsEl) {
            return;
        }

        const { placeholder } = this.drag;

        const cards = Array.from(cardsEl.querySelectorAll('.card'));

        let insertBefore = null;

        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;

            if (e.clientY < middleY) {
                insertBefore = card;
                break;
            }
        }

        if (insertBefore) {
            if (placeholder.nextSibling === insertBefore) {
                return;
            }

            cardsEl.insertBefore(placeholder, insertBefore);
            return;
        }

        if (cardsEl.lastChild !== placeholder) {
            cardsEl.appendChild(placeholder);
        }
    }

    onMouseUp() {
        if (!this.drag) {
            return;
        }

        const {
            placeholder,
            ghost,
            cardId,
            fromColumnId,
        } = this.drag;

        const dropColumnEl = placeholder.closest('[data-column-id]');
        const toColumnId = dropColumnEl ? dropColumnEl.dataset.columnId : fromColumnId;

        const cardsEl = dropColumnEl ? dropColumnEl.querySelector('[data-role="cards"]') : null;

        let toIndex = 0;
        if (cardsEl) {
            const items = Array.from(cardsEl.children);
            toIndex = items.indexOf(placeholder);
            if (toIndex < 0) {
                toIndex = items.length;
            }
        }

        this.detachDocumentListeners();

        ghost.remove();

        document.body.classList.remove('is-grabbing');
        document.documentElement.classList.remove('is-grabbing');

        this.drag = null;

        if (typeof this.onDrop === 'function') {
            this.onDrop({
                cardId,
                fromColumnId,
                toColumnId,
                toIndex,
            });
        }
    }

    moveGhost(pageX, pageY) {
        const { ghost, shiftX, shiftY } = this.drag;
        ghost.style.left = `${pageX - shiftX}px`;
        ghost.style.top = `${pageY - shiftY}px`;
    }

    attachDocumentListeners() {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    detachDocumentListeners() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    }

    cleanupDrag() {
        if (!this.drag) {
            return;
        }

        const { ghost } = this.drag;
        if (ghost && ghost.parentNode) {
            ghost.remove();
        }

        document.body.classList.remove('is-grabbing');
        document.documentElement.classList.remove('is-grabbing');

        this.drag = null;
    }
}
