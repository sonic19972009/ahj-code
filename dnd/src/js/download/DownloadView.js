export default class DownloadView {
    constructor(container) {
        this.container = container;
    }

    renderLayout() {
        this.container.innerHTML = `
            <div class="download" data-widget="download">
                <div class="download__header">
                    <h2 class="download__title">Download Manager</h2>

                    <div class="download__total">
                        Downloaded:
                        <span class="download__total-value" data-id="download-total">0 MB</span>
                    </div>
                </div>

                <div class="download__table-wrap">
                    <table class="download__table">
                        <thead>
                            <tr>
                                <th class="download__th">File</th>
                                <th class="download__th download__th_right">Size</th>
                                <th class="download__th download__th_right">Action</th>
                            </tr>
                        </thead>

                        <tbody data-id="download-body"></tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getRefs() {
        return {
            totalEl: this.container.querySelector('[data-id="download-total"]'),
            bodyEl: this.container.querySelector('[data-id="download-body"]'),
        };
    }

    setTotalMb(mb) {
        const { totalEl } = this.getRefs();
        totalEl.textContent = `${mb.toFixed(2)} MB`;
    }

    renderRows(items) {
        const { bodyEl } = this.getRefs();

        bodyEl.innerHTML = items.map((x) => DownloadView.rowHtml(x)).join('');
    }

    static rowHtml(item) {
        return `
            <tr class="download__tr">
                <td class="download__td">
                    <div class="download__file">
                        <div class="download__name">${DownloadView.escape(item.name)}</div>
                    </div>
                </td>

                <td class="download__td download__td_right">
                    <span class="download__size">${DownloadView.formatBytes(item.sizeBytes)}</span>
                </td>

                <td class="download__td download__td_right">
                    <button
                        class="download__btn"
                        type="button"
                        data-action="download-file"
                        data-id="${DownloadView.escape(item.id)}"
                    >
                        Download
                    </button>
                </td>
            </tr>
        `;
    }

    static formatBytes(bytes) {
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(2)} MB`;
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
