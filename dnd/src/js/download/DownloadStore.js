const STORAGE_KEY = 'ahj-dnd-download-total-bytes';

export default class DownloadStore {
    static loadTotalBytes() {
        const raw = localStorage.getItem(STORAGE_KEY);
        const num = Number(raw);
        if (!Number.isFinite(num) || num < 0) {
            return 0;
        }

        return num;
    }

    static saveTotalBytes(bytes) {
        localStorage.setItem(STORAGE_KEY, String(bytes));
    }
}
