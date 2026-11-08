import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('booking page has no WCAG 2.1 AA violations', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Service', { exact: true }).locator('option').first().waitFor({ state: 'attached' });

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
