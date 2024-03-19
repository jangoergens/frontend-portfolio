import { expect, test } from '@playwright/test';

test.describe('complete usage process', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});
	test('example button', async ({ page }) => {
		await page.click('text="Give it a try!"');
		await expect(page.locator('h2')).toHaveText('Top Comments for this Video');
		expect(page.url().endsWith('/czgOWmtGVGs')).toBeTruthy();
		await expect(
			page.getByText('Amazing video, really helped me understand the topic!'),
		).toBeVisible();
	});
	test('search bar', async ({ page }) => {
		await page.fill('input[name="videoSearch"]', 'https://www.youtube.com/watch?v=jb2AvF8XzII');
		await page.click('button[type="submit"]');
		expect(await page.getAttribute('iframe', 'src')).toBe(
			'https://www.youtube.com/embed/jb2AvF8XzII',
		);
		expect(page.url().endsWith('/jb2AvF8XzII')).toBeTruthy();
	});
});
