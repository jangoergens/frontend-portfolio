import { expect, test } from "@playwright/test";

test("personal homepage connects visitors with work, projects, and contact", async ({ page }) => {
	await page.goto("/en");
	await expect(page).toHaveTitle(/Jan Görgens/);
	const logo = page.getByRole("img", { exact: true, name: "plancraft" });
	await expect(logo).toBeVisible();
	await expect
		.poll(() =>
			logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
		)
		.toBe(true);
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jan Görgens");
	await expect(
		page.getByRole("link", { name: "Open TopComments, my YouTube comment finder" }),
	).toHaveAttribute("href", "https://topcomments.jangoergens.de");
	await expect(page.getByRole("link", { name: "Work GitHub" })).toHaveAttribute(
		"href",
		"https://github.com/janplancraft",
	);
	await page.getByRole("navigation").getByRole("link", { name: "Contact" }).click();
	await expect(page).toHaveURL(/#contact$/);
	await expect(page.getByRole("link", { name: "LinkedIn" })).toBeInViewport();
	await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
		"href",
		"https://www.linkedin.com/in/jan-goergens/",
	);
});

test("homepage stays readable and navigable on small phones", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [320, 375, 430]) {
		await page.setViewportSize({ height: 812, width });
		await page.goto("/en");
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
			width,
		);
		await page.getByRole("navigation").getByRole("link", { exact: true, name: "Work" }).click();
		await expect(page.getByRole("heading", { name: "Work & interests" })).toBeInViewport();
		await page.getByRole("link", { name: "Back to top" }).click();
		await expect(page.getByRole("navigation")).toBeInViewport();
	}
});

test("keyboard visitors can skip navigation", async ({ page }) => {
	await page.goto("/en");
	await page.keyboard.press("Tab");
	await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.locator("main")).toBeFocused();
});

test("introduction and contact remain available without JavaScript", async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto("/en");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jan Görgens");
	await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
	await context.close();
});

test("external links open a new tab while contact navigation stays on the page", async ({
	page,
}) => {
	await page.context().route("https://www.linkedin.com/in/jan-goergens/", async (route) => {
		await route.fulfill({ body: "LinkedIn", contentType: "text/html" });
	});
	await page.goto("/en");
	const contactNavigation = page.getByRole("navigation").getByRole("link", { name: "Contact" });
	await expect(contactNavigation).toHaveText("Contact");
	await contactNavigation.click();
	await expect(page).toHaveURL(/#contact$/);
	const popupPromise = page.waitForEvent("popup");
	await page.getByRole("link", { exact: true, name: "LinkedIn" }).click();
	const popup = await popupPromise;
	await expect(popup).toHaveURL("https://www.linkedin.com/in/jan-goergens/");
	await expect(page).toHaveURL(/#contact$/);
	await popup.close();

	for (const link of await page.locator('a[href^="https://"]').all()) {
		await expect(link).toHaveAttribute("target", "_blank");
		await expect(link).toHaveAttribute("rel", /noopener/);
	}
});

test("wide displays keep the stacked layout and readable paragraphs", async ({ page }) => {
	await page.setViewportSize({ height: 2160, width: 3840 });
	await page.goto("/en");
	const shell = await page.locator(".site-shell").boundingBox();
	expect(shell?.width).toBeLessThanOrEqual(900);
	const project = await page.locator(".project-section").boundingBox();
	const about = await page.locator(".about-section").boundingBox();
	expect(about?.y).toBeGreaterThan((project?.y ?? 0) + (project?.height ?? 0));
	expect(about?.x).toBe(project?.x);
	const avatar = page.getByRole("img", { name: "Avatar of Jan Görgens" });
	await expect(avatar).toBeVisible();
	expect((await avatar.boundingBox())?.width).toBeGreaterThanOrEqual(180);
	expect(
		await page
			.locator(".about-section p")
			.first()
			.evaluate((p) => p.getBoundingClientRect().width),
	).toBeLessThanOrEqual(650);
	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(3840);
});
