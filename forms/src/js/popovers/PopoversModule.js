import Popover from './Popover.js';

export default class PopoversModule {
    constructor(container) {
        this.container = container;

        this.button = null;
        this.popover = null;

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    init() {
        this.container.innerHTML = `
            <div class="popovers-root" data-widget="popovers-root">
                <button
                    class="popover-trigger"
                    type="button"
                    data-widget="popover-trigger"
                    data-title="Popover title"
                    data-content="And here's some amazing content. It's very engaging. Right?"
                >
                    Click to toggle popover
                </button>
            </div>
        `;


        this.button = this.container.querySelector('[data-widget="popover-trigger"]');
        this.button.addEventListener('click', this.onButtonClick);
    }

    destroy() {
        this.hidePopover();

        if (this.button) {
            this.button.removeEventListener('click', this.onButtonClick);
        }

        document.removeEventListener('click', this.onDocumentClick);
        window.removeEventListener('resize', this.onWindowResize);

        this.container.innerHTML = '';
        this.button = null;
    }

    onButtonClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.popover) {
            this.hidePopover();
            return;
        }

        this.showPopover();
    }

    onDocumentClick(event) {
        const isTrigger = event.target.closest('[data-widget="popover-trigger"]');
        const isPopover = event.target.closest('[data-widget="popover"]');

        if (!isTrigger && !isPopover) {
            this.hidePopover();
        }
    }

    onWindowResize() {
        if (this.popover) {
            this.positionPopover();
        }
    }

    showPopover() {
        const title = this.button.dataset.title;
        const content = this.button.dataset.content;

        this.popover = new Popover({ title, content });
        const el = this.popover.render();
        document.body.append(el);

        this.positionPopover();

        document.addEventListener('click', this.onDocumentClick);
        window.addEventListener('resize', this.onWindowResize);
    }

    hidePopover() {
        if (!this.popover) {
            return;
        }

        this.popover.destroy();
        this.popover = null;

        document.removeEventListener('click', this.onDocumentClick);
        window.removeEventListener('resize', this.onWindowResize);
    }

    positionPopover() {
        const popoverEl = document.querySelector('[data-widget="popover"]');
        if (!popoverEl) {
            return;
        }

        const buttonRect = this.button.getBoundingClientRect();

        popoverEl.style.left = '0px';
        popoverEl.style.top = '0px';

        const popoverRect = popoverEl.getBoundingClientRect();

        const left = Math.round(buttonRect.left + (buttonRect.width / 2) - (popoverRect.width / 2));
        const top = Math.round(buttonRect.top - popoverRect.height - 10);

        popoverEl.style.left = `${left}px`;
        popoverEl.style.top = `${top}px`;
    }

}
