import { expect, test } from "@playwright/test";

test("labels comment results when pagination was capped", async ({ page }) => {
	await page.route("**/api/comments/czgOWmtGVGs", (route) =>
		route.fulfill({
			body: "[]",
			headers: { "Content-Type": "application/json", "X-Comments-Partial": "true" },
			status: 200,
		}),
	);
	await page.goto("/czgOWmtGVGs");
	await expect(
		page.getByText(
			"Showing the most liked comments from a limited sample of this video's comments.",
		),
	).toBeVisible();
});

for (const [status, message] of [
	[429, "Too many requests. Please wait a minute before trying again."],
	[503, "The comment service is busy or temporarily unavailable. Please try again later."],
	[504, "Fetching comments took too long. Please try again later."],
] as const) {
	test(`shows a useful message for HTTP ${status}`, async ({ page }) => {
		await page.route("**/api/comments/czgOWmtGVGs", (route) =>
			route.fulfill({
				body: JSON.stringify({ error: "server details must not appear in the page" }),
				contentType: "application/json",
				status,
			}),
		);
		await page.goto("/czgOWmtGVGs");
		await expect(page.getByText(message)).toBeVisible();
		await expect(page.getByText("server details must not appear in the page")).toHaveCount(0);
	});
}
