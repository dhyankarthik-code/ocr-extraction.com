import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
    test('homepage should not have critical accessibility issues', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        // Log violations for debugging
        if (accessibilityScanResults.violations.length > 0) {
            console.log('Accessibility violations found:');
            accessibilityScanResults.violations.forEach((violation) => {
                console.log(`- ${violation.id}: ${violation.description}`);
                console.log(`  Impact: ${violation.impact}`);
                console.log(`  Nodes affected: ${violation.nodes.length}`);
            });
        }

        // Filter for critical and serious issues only
        const criticalViolations = accessibilityScanResults.violations.filter(
            (v) => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toEqual([]);
    });

    test('tools page should be accessible', async ({ page }) => {
        await page.goto('/tools');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        const criticalViolations = results.violations.filter(
            (v) => v.impact === 'critical' || v.impact === 'serious'
        );

        expect(criticalViolations).toEqual([]);
    });
});
