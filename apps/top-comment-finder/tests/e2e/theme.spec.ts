import { expect, test } from "@playwright/test";

test("responsive layout and persistent manual dark mode", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.setViewportSize({ height: 800, width: 1280 });
	await page.goto("/");
	await expect(page.locator("header")).toHaveCSS("height", "64px");
	await expect(page.locator("body")).toHaveCSS("font-family", /Inter Variable/);
	const lightBackground = await page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor);
	await page.getByRole("button", { name: "Enable Dark Mode" }).click();
	await expect(page.getByRole("button", { name: "Enable Light Mode" })).toBeVisible();
	await expect.poll(() => page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor)).not.toBe(lightBackground);
	await page.reload();
	await expect(page.getByRole("button", { name: "Enable Light Mode" })).toBeVisible();
	await page.setViewportSize({ height: 812, width: 375 });
	await expect(page.locator("header")).toHaveCSS("height", "64px");
	await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
	await page.getByRole("button", { name: "Enable Light Mode" }).click();
	await expect(page.locator("body")).toHaveCSS("background-color", lightBackground);
});

test("search controls, heading gradient and comment cards retain their styles", async ({ page }) => {
	await page.goto("/");
	await expect(page.locator("h1 span")).toHaveCSS("background-image", /linear-gradient/);
	await expect(page.getByRole("button", { exact: true, name: "Search" })).toHaveCSS("cursor", "pointer");
	await expect(page.locator('input[name="videoSearch"]')).toHaveCSS("border-top-width", "2px");
	await page.getByRole("button", { name: "Give it a try!" }).click();
	const comment = page.locator("ol > li").filter({ hasText: "Amazing video, really helped me understand the topic!" });
	await expect(comment).toHaveCSS("border-top-width", "2px");
	await expect(comment).toHaveCSS("box-shadow", /rgba/);
});
