import DownloadView from './DownloadView';
import DownloadStore from './DownloadStore';
import FILES from './files';

export default class DownloadApp {
    constructor(rootEl) {
        this.rootEl = rootEl;

        this.view = new DownloadView(this.rootEl);

        this.totalBytes = 0;
        this.items = [];

        this.isDestroyed = false;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.view.renderLayout();

        this.totalBytes = DownloadStore.loadTotalBytes();
        this.items = FILES.map((b) => ({
            id: b.id,
            name: b.name,
            filename: b.filename,
            dataUrl: b.dataUrl,
            sizeBytes: DownloadApp.getDataUrlByteLength(b.dataUrl),
        }));

        this.rootEl.addEventListener('click', this.onClick);

        this.render();
    }

    destroy() {
        this.isDestroyed = true;
        this.rootEl.removeEventListener('click', this.onClick);
        this.rootEl.innerHTML = '';
    }

    render() {
        this.view.setTotalMb(this.totalBytes / (1024 * 1024));
        this.view.renderRows(this.items);
    }

    onClick(e) {
        const btn = e.target.closest('[data-action="download-file"]');
        if (!btn) {
            return;
        }

        const { id } = btn.dataset;
        const item = this.items.find((x) => x.id === id);
        if (!item) {
            return;
        }

        if (!item.dataUrl || item.dataUrl === 'PASTE_DATA_URL_HERE') {
            this.view.setError('В files.js не вставлен dataUrl для этого файла.');
            return;
        }

        const { blob, bytes } = DownloadApp.dataUrlToBlob(item.dataUrl);

        const downloadName = item.filename || item.name || `file-${item.id}`;
        DownloadApp.triggerDownload(blob, downloadName);

        this.totalBytes += bytes;
        DownloadStore.saveTotalBytes(this.totalBytes);

        if (!this.isDestroyed) {
            this.render();
        }
    }

    static triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    }

    static dataUrlToBlob(dataUrl) {
        const commaIndex = dataUrl.indexOf(',');
        const header = dataUrl.slice(0, commaIndex);
        const b64 = dataUrl.slice(commaIndex + 1);

        const isBase64 = /;base64/i.test(header);
        if (!isBase64) {
            throw new Error('Expected base64 dataUrl');
        }

        const mimeMatch = header.match(/^data:([^;]+)/i);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

        const binary = atob(b64);
        const len = binary.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i += 1) {
            bytes[i] = binary.charCodeAt(i);
        }

        return {
            blob: new Blob([bytes], { type: mime }),
            bytes: bytes.length,
        };
    }

    static getDataUrlByteLength(dataUrl) {
        if (!dataUrl || typeof dataUrl !== 'string') {
            return 0;
        }

        const commaIndex = dataUrl.indexOf(',');
        if (commaIndex === -1) {
            return 0;
        }

        const header = dataUrl.slice(0, commaIndex);
        const payload = dataUrl.slice(commaIndex + 1);

        if (!/;base64/i.test(header)) {
            return 0;
        }

        const n = payload.length;

        let padding = 0;
        if (payload.endsWith('==')) {
            padding = 2;
        } else if (payload.endsWith('=')) {
            padding = 1;
        }

        return Math.floor((n * 3) / 4) - padding;
    }
}
