import { expect, test } from "@playwright/test";

test("about page has expected h1", async ({ page }) => {
	await page.goto("/about");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Comments, ordered by likes.");
	await page.goto("/"); // Rerun tests online
});
