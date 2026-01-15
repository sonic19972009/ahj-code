import App from '../app';

describe('DOM integration', () => {
    test('highlights detected card system', () => {
        document.body.innerHTML = `
            <form data-widget="card-form-widget">
                <ul data-id="card-icons">
                    <li class="card" data-system="visa"></li>
                    <li class="card" data-system="mastercard"></li>
                </ul>
                <input data-id="card-input" type="text">
                <button data-id="card-submit" type="submit">Validate</button>
                <p data-id="card-result"></p>
            </form>
        `;

        const app = new App(document);
        app.init();

        const input = document.querySelector('[data-id="card-input"]');
        input.value = '4111111111111111';
        input.dispatchEvent(new Event('input'));

        const visa = document.querySelector('[data-system="visa"]');
        const mastercard = document.querySelector('[data-system="mastercard"]');

        expect(visa.classList.contains('active')).toBe(true);
        expect(mastercard.classList.contains('active')).toBe(false);
    });

    test('shows invalid message on submit', () => {
        document.body.innerHTML = `
            <form data-widget="card-form-widget">
                <ul data-id="card-icons">
                    <li class="card" data-system="visa"></li>
                </ul>
                <input data-id="card-input" type="text">
                <button data-id="card-submit" type="submit">Validate</button>
                <p data-id="card-result"></p>
            </form>
        `;

        const app = new App(document);
        app.init();

        const form = document.querySelector('[data-widget="card-form-widget"]');
        const input = document.querySelector('[data-id="card-input"]');
        const result = document.querySelector('[data-id="card-result"]');

        input.value = '4111111111111112';
        form.dispatchEvent(new Event('submit'));

        expect(result.textContent).toBe('Invalid card number');
    });
});
