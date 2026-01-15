import App from '../app.js';

function setupDOM() {
    document.body.innerHTML = `
        <div>
            <form data-widget="card-form-widget">
                <ul data-id="card-icons">
                    <li data-system="visa" class="card"></li>
                    <li data-system="mastercard" class="card"></li>
                    <li data-system="mir" class="card"></li>
                </ul>

                <input data-id="card-input" type="text" />
                <button data-id="card-submit" type="submit">Validate</button>

                <p data-id="card-result"></p>
            </form>
        </div>
    `;

    const app = new App(document);
    app.init();
}

test.each([
    ['4111111111111111', 'visa', true],
    ['4111111111111112', 'visa', false],
    ['5555555555554444', 'mastercard', true],
])('dom: input %s highlights %s and submit => %s', (value, system, expectedValid) => {
    setupDOM();

    const input = document.querySelector('[data-id="card-input"]');
    const form = document.querySelector('[data-widget="card-form-widget"]');
    const result = document.querySelector('[data-id="card-result"]');
    const systemEl = document.querySelector(`[data-system="${system}"]`);

    input.value = value;
    input.dispatchEvent(new Event('input'));

    expect(systemEl.classList.contains('active')).toBe(true);

    form.dispatchEvent(new Event('submit'));

    expect(result.classList.contains(expectedValid ? 'valid' : 'invalid')).toBe(true);
});
