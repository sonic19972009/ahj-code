export default class TrelloView {
    constructor(container) {
        this.container = container;
    }

    render(state) {
        this.container.innerHTML = `
            <div class="board" data-widget="board">
                ${state.columns.map((col) => TrelloView.columnHtml(col)).join('')}
            </div>
        `;
    }

    static columnHtml(col) {
        return `
            <div class="column" data-column-id="${col.id}">
                <div class="column__title">${TrelloView.escape(col.title)}</div>

                <div class="cards" data-role="cards">
                    ${col.cards.map((card) => TrelloView.cardHtml(card)).join('')}
                </div>

                <div class="adder" data-role="adder">
                    <button class="adder__btn" data-action="open-add" type="button">+ Add another card</button>

                    <form class="adder__form adder__form_hidden" data-role="add-form">
                        <textarea class="adder__textarea" data-role="add-text" rows="3" placeholder="Enter a title for this card..."></textarea>
                        <div class="adder__controls">
                            <button class="adder__submit" data-action="add-card" type="submit">Add card</button>
                            <button class="adder__cancel" data-action="cancel-add" type="button">✕</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    static cardHtml(card) {
        return `
            <div class="card" data-card-id="${card.id}">
                <button class="card__remove" data-action="remove-card" type="button" aria-label="Remove">×</button>
                <div class="card__text">${TrelloView.escape(card.text)}</div>
            </div>
        `;
    }

    static escape(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }
}
