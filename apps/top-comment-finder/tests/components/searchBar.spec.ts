import { expect, test } from '@playwright/test';

const urlVariants = [
	'https://www.youtube.com/watch?v=jb2AvF8XzII',
	'http://www.youtube.com/watch?v=jb2AvF8XzII',
	'youtube.com/watch?v=jb2AvF8XzII',
	'https://youtu.be/jb2AvF8XzII',
	'jb2AvF8XzII',
	'https://www.youtube.com/embed/jb2AvF8XzII',
	'https://www.youtube.com/watch?v=jb2AvF8XzII&list=WL&index=9',
	'https://www.youtube.com/watch?v=jb2AvF8XzII&t=60s',
	'https://youtu.be/jb2AvF8XzII?t=120',
	'https://www.youtube.com/watch?v=jb2AvF8XzII&feature=youtu.be',
	'https://www.youtube.com/watch?v=jb2AvF8XzII&src=share',
	'https://www.youtube.com/watch?v=jb2AvF8XzII#t=1m30s',
	'https://youtu.be/jb2AvF8XzII?start=90',
];

test.describe('search bar urls', () => {
	urlVariants.forEach((url) => {
		test(`search bar with URL: ${url}`, async ({ page }) => {
			await page.goto('/');

			await page.fill('input[name="videoSearch"]', url);
			await page.click('button[type="submit"]');

			await expect(page.locator('h2')).toHaveText('Top Comments for this Video');
			expect(page.url().endsWith('/jb2AvF8XzII')).toBeTruthy();
		});
	});
});
