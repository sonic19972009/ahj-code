export default function initMenu(root = document) {
    const tabs = Array.from(root.querySelectorAll('[data-tab]'));
    const pages = Array.from(root.querySelectorAll('[data-page]'));

    function activate(name) {
        tabs.forEach((btn) => {
            btn.classList.toggle('is-active', btn.dataset.tab === name);
        });

        pages.forEach((page) => {
            page.classList.toggle('is-active', page.dataset.page === name);
        });

        root.dispatchEvent(new CustomEvent('tabchange', { detail: { tab: name } }));
    }

    tabs.forEach((btn) => {
        btn.addEventListener('click', () => activate(btn.dataset.tab));
    });

    activate('menu');
}
