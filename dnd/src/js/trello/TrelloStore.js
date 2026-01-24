const STORAGE_KEY = 'ahj-dnd-trello-state';

function uid() {
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default class TrelloStore {
    constructor() {
        this.state = TrelloStore.load();
    }

    static load() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch (e) {
                // ignore broken storage
            }
        }

        return {
            columns: [
                { id: 'todo', title: 'TODO', cards: [] },
                { id: 'inprogress', title: 'IN PROGRESS', cards: [] },
                { id: 'done', title: 'DONE', cards: [] },
            ],
        };
    }

    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }

    getState() {
        return this.state;
    }

    addCard(columnId, text) {
        const col = this.state.columns.find((c) => c.id === columnId);
        if (!col) {
            return;
        }

        col.cards.push({
            id: uid(),
            text,
        });

        this.save();
    }

    removeCard(cardId) {
        this.state.columns.forEach((col) => {
            const nextCards = col.cards.filter((c) => c.id !== cardId);
            col.cards.splice(0, col.cards.length, ...nextCards);
        });

        this.save();
    }

    moveCard({
        cardId,
        fromColumnId,
        toColumnId,
        toIndex,
    }) {
        const fromCol = this.state.columns.find((c) => c.id === fromColumnId);
        const toCol = this.state.columns.find((c) => c.id === toColumnId);

        if (!fromCol || !toCol) {
            return;
        }

        const fromIndex = fromCol.cards.findIndex((c) => c.id === cardId);
        if (fromIndex === -1) {
            return;
        }

        const [card] = fromCol.cards.splice(fromIndex, 1);

        const safeIndex = Math.max(0, Math.min(toIndex, toCol.cards.length));
        toCol.cards.splice(safeIndex, 0, card);

        this.save();
    }
}
