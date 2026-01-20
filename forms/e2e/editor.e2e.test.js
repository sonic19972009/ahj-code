import puppeteer from 'puppeteer';
import os from 'os';
import path from 'path';
import fs from 'fs';

describe('Editor widget (e2e)', () => {
    let browser;
    let page;

    const userDataDir = path.join(os.tmpdir(), `puppeteer_editor_${Date.now()}`);

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,
            userDataDir,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        try {
            if (page) {
                await page.close();
            }
        } finally {
            if (browser) {
                await browser.close();
            }
            if (fs.existsSync(userDataDir)) {
                fs.rmSync(userDataDir, { recursive: true, force: true });
            }
        }
    });

    async function openEditor() {
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
        await page.click('[data-tab="editor"]');
        await page.waitForSelector('[data-widget="editor-table"]', { timeout: 10000 });
        await page.waitForSelector('[data-id="add-btn"]', { timeout: 10000 });
    }

    test('should add, edit and remove product', async () => {
        await openEditor();

        await page.click('[data-id="add-btn"]');
        await page.waitForSelector('[data-widget="modal"]', { timeout: 10000 });

        await page.type('[data-id="name-input"]', 'Apple');
        await page.type('[data-id="price-input"]', '100');
        await page.click('[data-id="save-btn"]');

        await page.waitForSelector('tr[data-id]', { timeout: 10000 });

        const rowsAfterAdd = await page.$$eval('tr[data-id]', (rows) => rows.length);
        expect(rowsAfterAdd).toBe(1);

        await page.click('tr[data-id] [data-id="edit-btn"]');
        await page.waitForSelector('[data-widget="modal"]', { timeout: 10000 });

        await page.click('[data-id="price-input"]', { clickCount: 3 });
        await page.type('[data-id="price-input"]', '250');
        await page.click('[data-id="save-btn"]');

        const priceText = await page.$eval(
            'tr[data-id] [data-col="price"]',
            (el) => el.textContent.trim(),
        );
        expect(priceText).toBe('250');

        await page.click('tr[data-id] [data-id="remove-btn"]');
        await page.waitForSelector('[data-id="confirm-remove-btn"]', { timeout: 10000 });
        await page.click('[data-id="confirm-remove-btn"]');

        await page.waitForFunction(() => document.querySelectorAll('tr[data-id]').length === 0, {
            timeout: 10000,
        });

        const rowsAfterRemove = await page.$$eval('tr[data-id]', (rows) => rows.length);
        expect(rowsAfterRemove).toBe(0);
    });

    test('should show validation errors and allow submit again', async () => {
        await openEditor();

        await page.click('[data-id="add-btn"]');
        await page.waitForSelector('[data-widget="modal"]', { timeout: 10000 });

        await page.click('[data-id="save-btn"]');

        const nameError = await page.$eval('[data-error="name"]', (el) => el.textContent.trim());
        const priceError = await page.$eval('[data-error="price"]', (el) => el.textContent.trim());

        expect(nameError.length).toBeGreaterThan(0);
        expect(priceError.length).toBeGreaterThan(0);

        await page.type('[data-id="name-input"]', 'Orange');
        await page.type('[data-id="price-input"]', '10');
        await page.click('[data-id="save-btn"]');

        await page.waitForSelector('tr[data-id]', { timeout: 10000 });

        const rows = await page.$$eval('tr[data-id]', (r) => r.length);
        expect(rows).toBe(1);
    });
});
