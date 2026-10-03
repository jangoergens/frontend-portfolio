import { expect, test } from "@playwright/test";

test("direct About visits support system theme and persist manual theme changes", async ({
	page,
}) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.goto("/about");
	await expect(page.getByRole("button", { name: "Enable Light Mode" })).toBeVisible();
	await expect(page.locator("html")).toHaveClass(/dark/);

	await page.getByRole("button", { name: "Enable Light Mode" }).click();
	await expect(page.locator("html")).not.toHaveClass(/dark/);
	await page.reload();
	await expect(page.getByRole("button", { name: "Enable Dark Mode" })).toBeVisible();
	await expect(page.locator("html")).not.toHaveClass(/dark/);
});
