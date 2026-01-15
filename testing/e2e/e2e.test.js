import puppeteer from 'puppeteer';

jest.setTimeout(60000);

describe('Card form', () => {
    let browser;
    let page;
    const baseUrl = 'http://localhost:9000';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    test('shows valid result for valid card', async () => {
        await page.goto(baseUrl);

        await page.waitForSelector('[data-widget="card-form-widget"]');

        await page.type('[data-id="card-input"]', '4111111111111111');
        await page.click('[data-id="card-submit"]');

        await page.waitForSelector('[data-id="card-result"].valid');
    });
});
