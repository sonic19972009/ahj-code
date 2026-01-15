import puppeteer from 'puppeteer';

jest.setTimeout(60000);

describe('Credit Card Validator (Puppeteer)', () => {
    let browser;
    let page;
    const baseUrl = 'http://localhost:9000';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('valid card number', async () => {
        await page.goto(baseUrl);
        await page.waitForSelector('[data-widget="card-form-widget"]');

        await page.click('[data-id="card-input"]', { clickCount: 3 });
        await page.type('[data-id="card-input"]', '4111111111111111');
        await page.click('[data-id="card-submit"]');

        await page.waitForSelector('[data-id="card-result"].valid');
    });

    test('invalid card number', async () => {
        await page.goto(baseUrl);
        await page.waitForSelector('[data-widget="card-form-widget"]');

        await page.click('[data-id="card-input"]', { clickCount: 3 });
        await page.type('[data-id="card-input"]', '4111111111111112');
        await page.click('[data-id="card-submit"]');

        await page.waitForSelector('[data-id="card-result"].invalid');
    });
});
