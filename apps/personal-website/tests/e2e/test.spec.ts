import { test } from "@playwright/test";

test.describe("complete usage process", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("/");
	});
});
