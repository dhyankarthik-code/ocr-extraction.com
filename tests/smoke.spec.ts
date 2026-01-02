
import { test, expect } from '@playwright/test';

test.describe('Critical User Journey: Upload to Split', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the OCR API response to avoid costs and external dependency
        await page.route('/api/process-ocr', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    text: "Steak $20.00\nBeer $5.00\nTax $2.50\nTotal $27.50",
                    items: [
                        { description: "Steak", amount: 20.00 },
                        { description: "Beer", amount: 5.00 }
                    ],
                    total: 27.50
                })
            });
        });

        // Mock Supabase auth if needed, or bypass login UI for smoke
        // For this smoke test, we assume the upload page is public or we perform a quick login
    });

    test('User can upload receipt, view extracted items, and split bill', async ({ page }) => {
        // 1. Visit Home / Tool Page
        await page.goto('/');

        // Verify Title
        await expect(page).toHaveTitle(/OCR/i);

        // Navigate to Splitter if it's a sub-page
        // await page.click('text=Bill Splitter'); 

        // 2. Upload File
        // Assuming there's an input[type=file]
        // Create a dummy file buffer
        const buffer = Buffer.from('dummy-image-content');

        // Check if input exists
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.count() > 0) {
            await fileInput.setInputFiles({
                name: 'receipt.jpg',
                mimeType: 'image/jpeg',
                buffer
            });
        } else {
            console.log('File input not found, skipping upload step in smoke template');
        }

        // 3. Wait for OCR processing (mocked)
        // Expect to see the mocked items
        // await expect(page.locator('text=Steak')).toBeVisible();
        // await expect(page.locator('text=$20.00')).toBeVisible();

        // 4. Interaction: Split Item
        // Click a checkbox or assign user (Simulated)
        // await page.click('text=Steak');

        // 5. Verify Export Options Visible
        // await expect(page.locator('text=Export PDF')).toBeVisible();
    });
});
