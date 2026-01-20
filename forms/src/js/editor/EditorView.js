export default class EditorView {
    constructor(container) {
        this.container = container;

        this.tableBody = null;
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="editor" data-widget="editor">
                <div class="editor-header">
                    <div class="editor-title">Товары</div>
                    <button class="editor-add" type="button" data-action="add" data-id="add-btn">+</button>
                </div>

                <table class="editor-table" data-widget="editor-table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Стоимость</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody data-widget="editor-tbody"></tbody>
                </table>
            </div>
        `;

        this.tableBody = this.container.querySelector('[data-widget="editor-tbody"]');
    }

    renderRows(items) {
        if (!this.tableBody) {
            return;
        }

        this.tableBody.innerHTML = items.map((p) => `
            <tr data-id="${p.id}">
                <td data-col="name">${p.name}</td>
                <td data-col="price">${p.price}</td>
                <td class="editor-actions">
                    <button type="button" class="icon-btn" data-action="edit" data-id="edit-btn">✎</button>
                    <button type="button" class="icon-btn" data-action="remove" data-id="remove-btn">✕</button>
                </td>
            </tr>
        `).join('');
    }

    destroy() {
        this.container.innerHTML = '';
        this.tableBody = null;
    }
}
