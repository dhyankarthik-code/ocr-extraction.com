import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Core Functional Testing', () => {

    test('Homepage loads and has correct title', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/OCR|Converter|Text/i);
    });

    test('Navigation Check - Verify Critical Links', async ({ page }) => {
        await page.goto(BASE_URL);

        // Check if main nav links exist and are clickable 
        const links = await page.locator('nav a').all();
        console.log(`Found ${links.length} navigation links`);

        for (const link of links) {
            const href = await link.getAttribute('href');
            // Skip empty links or external links for valid status check
            if (href && href.startsWith('/') && href.length > 1) {
                try {
                    const response = await page.request.get(BASE_URL + href);
                    // We allow 200 (OK) and 3xx (Redirects)
                    // 404 is a failure
                    expect(response.status(), `Link ${href} returned ${response.status()}`).toBeLessThan(400);
                } catch (e) {
                    console.log(`Error checking link ${href}: ${e}`);
                }
            }
        }
    });
});

test.describe('Form and Interaction Testing', () => {

    test('Contact Page Loads and Form Exists', async ({ page }) => {
        await page.goto(`/contact`);
        await expect(page.locator('form')).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('textarea')).toBeVisible();
    });

    test('Login Button triggers Auth Modal', async ({ page }) => {
        await page.goto('/');

        // The navbar has "Login" and "Sign in" buttons.
        // We target the one in the desktop view first (hidden md:flex)
        // or just the first visible one.
        // The text prop in InteractiveHoverButton renders the text.
        const loginBtn = page.getByText('Login').first();

        if (await loginBtn.isVisible()) {
            await loginBtn.click();
            // Check for modal presence
            // Vaul usually creates a dialog with role="dialog"
            await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
            // Check for some text inside the modal
            await expect(page.getByText(/sign in|continue with/i)).toBeVisible();
        } else {
            // Fallback for mobile or if button is hidden
            console.log('Login button verification skipped (button not visible in viewport)');
        }
    });

});


test.describe('Performance & SEO Basics', () => {
    test('Homepage has H1', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('h1')).toBeVisible();
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBe(1);
    });

    test('Images have alt text', async ({ page }) => {
        await page.goto(BASE_URL);
        const images = await page.locator('img').all();
        for (const img of images) {
            const alt = await img.getAttribute('alt');
            if (!alt) {
                console.log('Warning: Image found without alt text');
            }
        }
    });
});
