import { test, expect } from '@playwright/test';

// Critical User Journey: Home -> Login (Skipped/Implicit) -> OCR Upload -> Result Checking
test.describe('Smoke Test: Critical Path (Mocked)', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Mistral/Google OCR API to prevent costs and external flakiness
        // Matches response shape from app/api/ocr/route.ts
        await page.route('**/api/ocr', async route => {
            console.log('Intercepted /api/ocr request - Returning MOCK');

            // Mocking a successful Image OCR response
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    isPDF: false,
                    text: "MOCKED RECEIPT\nItem 1  $10.00\nItem 2  $20.00\nTotal   $30.00",
                    rawText: "MOCKED RECEIPT\nItem 1  $10.00\nItem 2  $20.00\nTotal   $30.00",
                    characters: 50,
                    warnings: [],
                    method: 'mocked_response'
                })
            });
        });

        // Mock Usage API to prevent DB calls (ECONNREFUSED)
        await page.route('**/api/user/usage', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ usageMB: 0, limit: 10 })
            });
        });
    });

    test('should load home page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/OCR/i);
    });

    test('should complete image to excel journey with mocked backend', async ({ page }) => {
        await page.goto('/tools/image-to-excel');

        // Ensure the upload area/button is visible
        // Adjust selector based on actual generic-tool.tsx or smart-upload-zone implementation
        // Usually input[type="file"] is hidden, but accessible via label or direct method
        const fileInput = page.locator('input[type="file"]').first();

        // Create a mock file
        await fileInput.setInputFiles({
            name: 'test-receipt.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('mock-image-content')
        });

        // Wait for the UI to react. 
        // Typically there is a "Processing" state or immediate result display.
        // We verify that our MOCKED text appears on the screen.

        // Assertions: using a flexible locator to find the result text
        await expect(page.getByText('MOCKED RECEIPT')).toBeVisible({ timeout: 20000 });
        await expect(page.getByText('Total   $30.00')).toBeVisible();
    });
});
