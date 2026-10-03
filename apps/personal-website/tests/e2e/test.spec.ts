import { expect, test } from "@playwright/test";

test("home page renders and links to the about page", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle("Personal Website");
	await expect(page.getByText("Demo Page")).toBeVisible();
	await page.getByRole("link", { exact: true, name: "About" }).click();
	await expect(page.getByRole("heading", { exact: true, name: "About" })).toBeVisible();
});
