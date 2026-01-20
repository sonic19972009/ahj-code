import puppeteer from 'puppeteer';
import os from 'os';
import path from 'path';
import fs from 'fs';

describe('Trip Calendar (e2e)', () => {
    let browser;
    let page;

    const userDataDir = path.join(os.tmpdir(), `puppeteer_trip_${Date.now()}`);

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

    async function openTripAndWait() {
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });

        await page.click('[data-tab="trip"]');

        await page.waitForSelector('[data-widget="trip"]', { timeout: 10000 });
        await page.waitForSelector('[data-id="roundtrip"]', { timeout: 10000 });
        await page.waitForSelector('[data-id="depart-input"]', { timeout: 10000 });
        await page.waitForSelector('[data-id="return-block"]', { timeout: 10000 });
    }

    test('should toggle return input by roundtrip checkbox', async () => {
        await openTripAndWait();

        const hidden1 = await page.$eval(
            '[data-id="return-block"]',
            (el) => el.classList.contains('hidden'),
        );
        expect(hidden1).toBe(true);

        await page.click('[data-id="roundtrip"]');

        const hidden2 = await page.$eval(
            '[data-id="return-block"]',
            (el) => el.classList.contains('hidden'),
        );
        expect(hidden2).toBe(false);

        await page.click('[data-id="roundtrip"]');

        const hidden3 = await page.$eval(
            '[data-id="return-block"]',
            (el) => el.classList.contains('hidden'),
        );
        expect(hidden3).toBe(true);
    });

    test('should not allow selecting past dates for depart', async () => {
        await openTripAndWait();

        await page.click('[data-id="depart-input"]');
        await page.waitForSelector('[data-widget="calendar"]', { timeout: 10000 });

        const disabledCount = await page.$$eval('.cal-day:disabled', (els) => els.length);
        expect(disabledCount).toBeGreaterThan(0);

        await page.click('.cal-day:not(:disabled)');

        const departValue = await page.$eval('[data-id="depart-input"]', (el) => el.value.trim());
        expect(departValue.length).toBeGreaterThan(0);
    });

    test('return date cannot be earlier than depart', async () => {
        await openTripAndWait();

        await page.click('[data-id="roundtrip"]');

        await page.click('[data-id="depart-input"]');
        await page.waitForSelector('[data-widget="calendar"]', { timeout: 10000 });
        await page.click('.cal-day:not(:disabled)');

        await page.click('[data-id="return-input"]');
        await page.waitForSelector('[data-widget="calendar"]', { timeout: 10000 });

        const disabledCount = await page.$$eval('.cal-day:disabled', (els) => els.length);
        expect(disabledCount).toBeGreaterThan(0);

        await page.click('.cal-day:not(:disabled)');

        const retValue = await page.$eval('[data-id="return-input"]', (el) => el.value.trim());
        expect(retValue.length).toBeGreaterThan(0);
    });
});
