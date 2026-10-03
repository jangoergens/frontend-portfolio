import { expect, test } from "@playwright/test";

test("responsive layout and persistent manual dark mode", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.setViewportSize({ height: 800, width: 1280 });
	await page.goto("/");
	await expect(page.locator("header")).toHaveCSS("height", "64px");
	await expect(page.locator("body")).toHaveCSS("font-family", /Inter Variable/);
	expect(
		await page.evaluate(async () => {
			const fonts = await document.fonts.load('400 16px "Inter Variable"', "Görgens Việt Nam");
			return fonts.length > 0 && fonts.every((font) => font.status === "loaded");
		}),
	).toBe(true);
	const lightBackground = await page
		.locator("body")
		.evaluate((body) => getComputedStyle(body).backgroundColor);
	await page.getByRole("button", { name: "Enable Dark Mode" }).click();
	await expect(page.getByRole("button", { name: "Enable Light Mode" })).toBeVisible();
	await expect
		.poll(() => page.locator("body").evaluate((body) => getComputedStyle(body).backgroundColor))
		.not.toBe(lightBackground);
	await page.reload();
	await expect(page.getByRole("button", { name: "Enable Light Mode" })).toBeVisible();
	await page.setViewportSize({ height: 812, width: 375 });
	await expect(page.locator("header")).toHaveCSS("height", "64px");
	await expect
		.poll(() => page.evaluate(() => document.documentElement.scrollWidth))
		.toBeLessThanOrEqual(375);
	await page.getByRole("button", { name: "Enable Light Mode" }).click();
	await expect(page.locator("body")).toHaveCSS("background-color", lightBackground);
});
