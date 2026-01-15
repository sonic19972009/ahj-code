import { detectCardSystem, validateCard } from './validators.js';

export default class CardWidget {
    constructor(container) {
        this.container = container;
        this.iconsRoot = this.container.querySelector('[data-id="card-icons"]');
        this.input = this.container.querySelector('[data-id="card-input"]');
        this.result = this.container.querySelector('[data-id="card-result"]');

        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static highlightSystem(iconsRoot, system) {
        const icons = Array.from(iconsRoot.querySelectorAll('[data-system]'));

        icons.forEach((icon) => {
            const active = system && icon.dataset.system === system;
            icon.classList.toggle('active', active);
        });
    }

    onInput() {
        const system = detectCardSystem(this.input.value);
        CardWidget.highlightSystem(this.iconsRoot, system);
        this.result.textContent = '';
        this.result.classList.remove('valid', 'invalid');
    }

    onSubmit(event) {
        event.preventDefault();

        const result = validateCard(this.input.value);

        if (result.isValid) {
            this.result.textContent = `Valid ${result.system}`;
            this.result.classList.add('valid');
            this.result.classList.remove('invalid');
        } else {
            this.result.textContent = 'Invalid card number';
            this.result.classList.add('invalid');
            this.result.classList.remove('valid');
        }
    }

    bindToDOM() {
        this.input.addEventListener('input', this.onInput);
        this.container.addEventListener('submit', this.onSubmit);
    }
}
