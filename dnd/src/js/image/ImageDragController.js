export default class ImageDragController {
    constructor(listEl, { onDrop }) {
        this.listEl = listEl;
        this.onDrop = onDrop;

        this.drag = null;

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }

    init() {
        this.listEl.addEventListener('mousedown', this.onMouseDown);
    }

    destroy() {
        this.listEl.removeEventListener('mousedown', this.onMouseDown);
        this.detachDocumentListeners();
        this.cleanup();
    }

    onMouseDown(e) {
        if (e.button !== 0) {
            return;
        }

        const itemEl = e.target.closest('.image__item');
        if (!itemEl || !this.listEl.contains(itemEl)) {
            return;
        }

        if (e.target.closest('[data-action="image-remove"]')) {
            return;
        }

        e.preventDefault();

        const rect = itemEl.getBoundingClientRect();
        const shiftX = e.clientX - rect.left;
        const shiftY = e.clientY - rect.top;

        const placeholder = document.createElement('li');
        placeholder.className = 'image__placeholder';
        placeholder.style.height = `${rect.height}px`;

        itemEl.replaceWith(placeholder);

        const ghost = itemEl.cloneNode(true);
        ghost.classList.add('image__ghost');
        ghost.style.width = `${rect.width}px`;

        document.body.append(ghost);

        this.drag = {
            id: Number(itemEl.dataset.id),
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

        if (elem.closest('.image__placeholder')) {
            return;
        }

        const { placeholder } = this.drag;

        const insertBefore = this.getInsertBeforeElement(e.clientX, e.clientY);

        if (!insertBefore) {
            if (this.listEl.lastChild !== placeholder) {
                this.listEl.appendChild(placeholder);
            }
            return;
        }

        if (placeholder.nextSibling === insertBefore) {
            return;
        }

        this.listEl.insertBefore(placeholder, insertBefore);
    }

    onMouseUp() {
        if (!this.drag) {
            return;
        }

        const { id, placeholder, ghost } = this.drag;

        const beforeEl = placeholder.nextElementSibling;

        let beforeId = null;
        if (beforeEl && beforeEl.classList.contains('image__item')) {
            beforeId = Number(beforeEl.dataset.id);
        }

        this.detachDocumentListeners();
        ghost.remove();

        document.body.classList.remove('is-grabbing');
        document.documentElement.classList.remove('is-grabbing');

        this.drag = null;

        if (typeof this.onDrop === 'function') {
            this.onDrop({
                id,
                beforeId,
                placeholder,
            });
        }
    }

    getInsertBeforeElement(clientX, clientY) {
        const items = Array.from(this.listEl.querySelectorAll('.image__item'));

        items.sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();

            if (ra.top !== rb.top) {
                return ra.top - rb.top;
            }

            return ra.left - rb.left;
        });

        for (const item of items) {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            if (clientY < centerY) {
                return item;
            }

            if (clientY >= rect.top && clientY <= rect.bottom && clientX < centerX) {
                return item;
            }
        }

        return null;
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

    cleanup() {
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
