export default class MenuModule {
    constructor(container, onNavigate) {
        this.container = container;
        this.onNavigate = onNavigate;

        this.onClick = this.onClick.bind(this);
    }

    init() {
        this.render();
        this.container.addEventListener('click', this.onClick);
    }

    destroy() {
        this.container.removeEventListener('click', this.onClick);
        this.container.innerHTML = '';
    }

    onClick(e) {
        const link = e.target.closest('[data-go]');
        if (!link) {
            return;
        }

        e.preventDefault();
        this.onNavigate(link.dataset.go);
    }

    render() {
        this.container.innerHTML = `
            <div class="menu">
                <h1 class="menu__title">DnD</h1>

                <ul class="menu-list">
                    <li>
                        <a href="#" class="menu-link" data-go="trello">
                            Trello
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-go="image">
                            Image Manager
                        </a>
                    </li>
                    <li>
                        <a href="#" class="menu-link" data-go="download">
                            Download Manager
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }
}
