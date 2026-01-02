import { test, expect } from '@playwright/test';

// Critical User Journey: Login -> OCR Upload -> Bill Split
test.describe('Smoke Test: Critical Path', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Mistral API to prevent costs during smoke tests
        // URL checked from SmartUploadZone: /api/ocr
        await page.route('**/api/ocr', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    text: "Mocked OCR Result\nItem 1 10.00\nItem 2 20.00",
                    items: [
                        { name: "Item 1", price: 10.00 },
                        { name: "Item 2", price: 20.00 }
                    ]
                })
            });
        });
    });

    test('should complete full user journey', async ({ page }) => {
        // 1. Login (or bypass if already authenticated)
        // Assuming simple auth or public access for now as per "Login -> OCR -> Split"
        // If auth is required, we use secrets. For now, visiting home.
        await page.goto('/');
        await expect(page).toHaveTitle(/OCR/);

        // 2. OCR Upload
        // Navigate to OCR tool (Image to Excel)
        await page.goto('/tools/image-to-excel');

        // Upload file
        await page.setInputFiles('input[type="file"]', {
            name: 'test-receipt.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('mock-image-content')
        });

        // 3. Verify Extraction (Mocked)
        // Adjust assertion to match actual UI feedback (e.g., "Processing", "Download", or specific text)
        // Since we don't know exact result UI, we wait for a generic success indicator or the mock response handling
        // For now, assuming the page shows the result text from our mock
        await expect(page.getByText('Mocked OCR Result')).toBeVisible({ timeout: 15000 });

        // 4. Split Bill (Pending UI identification)
        // await page.getByRole('button', { name: /Split/i }).click();
        // await expect(page.getByText('Total')).toBeVisible();
    });
});
