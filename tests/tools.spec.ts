import { test, expect } from '@playwright/test';

test.describe('Tool Pages Availability', () => {

    const toolsToCheck = [
        'image-to-text',
        'word-to-pdf',
        'pdf-to-word',
        'excel-to-pdf'
    ];

    toolsToCheck.forEach(tool => {
        test(`Tool page /tools/${tool} loads correctly`, async ({ page }) => {
            await page.goto(`/tools/${tool}`);

            // Expect a main heading
            await expect(page.locator('h1')).toBeVisible();

            // Expect some sort of upload area or input
            // Common patterns: "Drop files here", "Choose file", or an input type="file"
            // Check for upload area using broad keywords
            const uploadArea = page.getByText(/drop files|choose file|select|upload/i).first();
            await expect(uploadArea).toBeVisible();

            // Also verify we didn't land on a 404 page (Next.js 404 usually says "404" or "This page could not be found")
            await expect(page.getByText('This page could not be found')).not.toBeVisible();
        });
    });

});
