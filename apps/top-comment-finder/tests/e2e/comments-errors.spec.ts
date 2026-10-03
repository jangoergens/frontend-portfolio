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
	[403, "Comments are unavailable for this video."],
	[404, "This video is unavailable or private."],
	[429, "Too many requests. Please wait a minute before trying again."],
	[502, "Unable to load comments. Please try again later."],
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

for (const [code, status, message] of [
	["comments_disabled", 403, "Comments are disabled for this video."],
	["video_unavailable", 404, "This video is unavailable or private."],
	[
		"youtube_configuration_error",
		503,
		"The comment service cannot access YouTube right now. Please try again later.",
	],
	[
		"youtube_quota_exceeded",
		503,
		"The comment service has reached its YouTube quota. Please try again later.",
	],
] as const) {
	test(`shows a useful message for ${code}`, async ({ page }) => {
		await page.route("**/api/comments/czgOWmtGVGs", (route) =>
			route.fulfill({
				body: JSON.stringify({ code, error: "server details must not appear in the page" }),
				contentType: "application/json",
				status,
			}),
		);
		await page.goto("/czgOWmtGVGs");
		await expect(page.getByText(message)).toBeVisible();
		await expect(page.getByText("server details must not appear in the page")).toHaveCount(0);
	});
}

test("handles a proxy's non-JSON error response", async ({ page }) => {
	await page.route("**/api/comments/czgOWmtGVGs", (route) =>
		route.fulfill({ body: "error code: 502", contentType: "text/plain", status: 502 }),
	);
	await page.goto("/czgOWmtGVGs");
	await expect(page.getByText("Unable to load comments. Please try again later.")).toBeVisible();
});

test("ignores unknown API error codes", async ({ page }) => {
	await page.route("**/api/comments/czgOWmtGVGs", (route) =>
		route.fulfill({
			body: JSON.stringify({ code: "toString", error: "server details must not appear" }),
			contentType: "application/json",
			status: 503,
		}),
	);
	await page.goto("/czgOWmtGVGs");
	await expect(
		page.getByText(
			"The comment service is busy or temporarily unavailable. Please try again later.",
		),
	).toBeVisible();
});
