import { expect, test } from "@playwright/test";

test.describe("German browser preferences", () => {
	test.use({ locale: "de-DE" });

	test("neutral entry selects German and preserves the query and section", async ({ page }) => {
		await page.goto("/?source=conference#contact");
		await expect(page).toHaveURL("/de?source=conference#contact");
		await expect(page.locator("html")).toHaveAttribute("lang", "de");
		await expect(page.getByRole("heading", { name: "Arbeit & Interessen" })).toBeVisible();
		await expect(page.getByRole("form", { name: "Jan eine Nachricht senden" })).toBeVisible();
		await expect(page.getByRole("link", { exact: true, name: "Deutsch" })).toHaveAttribute(
			"aria-current",
			"true",
		);
	});

	test("manual choice survives reload and overrides browser language at entry", async ({
		page,
	}) => {
		await page.goto("/de#contact");
		await page.getByRole("link", { exact: true, name: "English" }).click();
		await expect(page).toHaveURL("/en#contact");
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
		await page.reload();
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
		await page.goto("/");
		await expect(page).toHaveURL("/en");
		await expect(page.getByRole("heading", { name: "Work & interests" })).toBeVisible();
		await page.goto("/de");
		await expect(page).toHaveURL("/de");
		await expect(page.locator("html")).toHaveAttribute("lang", "de");
	});

	test("explicit English URL overrides a German browser and saved preference", async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem("language", "de"));
		await page.goto("/en/about");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
		await expect(page).toHaveURL("/en/about");
		await expect(page.locator("html")).toHaveAttribute("lang", "en");
	});

	test("legacy about entry selects the matching localized page", async ({ page }) => {
		await page.goto("/about?source=bookmark#main");
		await expect(page).toHaveURL("/de/about?source=bookmark#main");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText("Über mich");
	});
});

for (const locale of ["de-AT", "de-CH", "en-GB", "fr-FR"]) {
	test(`selects a supported language for browser locale ${locale}`, async ({ browser }) => {
		const context = await browser.newContext({ locale });
		try {
			const page = await context.newPage();
			await page.goto("/");
			await expect(page).toHaveURL(locale.startsWith("de") ? "/de" : "/en");
		} finally {
			await context.close();
		}
	});
}

test("language selection uses the first supported browser preference", async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "languages", { value: ["fr-FR", "de-CH", "en-US"] });
	});
	await page.goto("/");
	await expect(page).toHaveURL("/de");
});

test("language selection and links work with local storage disabled", async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(window, "localStorage", {
			get() {
				throw new Error("Storage disabled");
			},
		});
		Object.defineProperty(navigator, "languages", { value: ["de-DE", "en-US"] });
	});
	await page.goto("/");
	await expect(page).toHaveURL("/de");
	await page.getByRole("link", { exact: true, name: "English" }).click();
	await expect(page).toHaveURL("/en");
	await expect(page.getByRole("heading", { name: "Work & interests" })).toBeVisible();
});

test("language links preserve the current page, query, and fragment", async ({ page }) => {
	await page.goto("/en/about?source=profile#main");
	await page.getByRole("link", { exact: true, name: "Deutsch" }).click();
	await expect(page).toHaveURL("/de/about?source=profile#main");
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Über mich");
	await expect(page).toHaveTitle("Über mich — Jan Görgens");
	await page.getByRole("navigation").getByRole("link", { exact: true, name: "Kontakt" }).click();
	await expect(page).toHaveURL("/de#contact");
	await expect(page.getByRole("form", { name: "Jan eine Nachricht senden" })).toBeVisible();
});

for (const locale of ["de", "en"]) {
	for (const suffix of ["", "/about"]) {
		test(`${locale}${suffix} serves localized HTML and search metadata without JavaScript`, async ({
			browser,
			request,
		}) => {
			const response = await request.get(`/${locale}${suffix}`);
			expect(response.ok()).toBe(true);
			expect(await response.text()).toContain(`<html lang="${locale}">`);
			const context = await browser.newContext({
				javaScriptEnabled: false,
				locale: locale === "de" ? "en-US" : "de-DE",
			});
			try {
				const page = await context.newPage();
				await page.goto(`/${locale}${suffix}`);
				await expect(page.locator("html")).toHaveAttribute("lang", locale);
				await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
					"href",
					`https://jangoergens.de/${locale}${suffix}`,
				);
				for (const alternative of ["de", "en"]) {
					await expect(page.locator(`link[hreflang="${alternative}"]`)).toHaveAttribute(
						"href",
						`https://jangoergens.de/${alternative}${suffix}`,
					);
				}
				await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
					"href",
					`https://jangoergens.de${suffix || "/"}`,
				);
				const other = locale === "de" ? "English" : "Deutsch";
				await page.getByRole("link", { exact: true, name: other }).click();
				await expect(page).toHaveURL(`/${locale === "de" ? "en" : "de"}${suffix}`);
			} finally {
				await context.close();
			}
		});
	}
}

test("German navigation fits small phones in both themes", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	for (const width of [320, 375, 430]) {
		await page.setViewportSize({ height: 812, width });
		await page.goto("/de");
		for (const theme of ["Dunklen Modus aktivieren", "Hellen Modus aktivieren"]) {
			expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
				width,
			);
			await expect(page.getByRole("link", { exact: true, name: "Deutsch" })).toBeInViewport();
			await page.getByRole("button", { name: theme }).click();
		}
		await page.getByRole("navigation").getByRole("link", { exact: true, name: "Arbeit" }).click();
		await expect(page.getByRole("heading", { name: "Arbeit & Interessen" })).toBeInViewport();
	}
});

test("German form validation follows the page language", async ({ page }) => {
	await page.goto("/de#contact");
	const form = page.getByRole("form", { name: "Jan eine Nachricht senden" });
	const submit = form.getByRole("button", { name: "Nachricht senden" });
	test.skip(await submit.isDisabled(), "No Formspree endpoint configured in this build.");
	await submit.click();
	const name = form.getByRole("textbox", { exact: true, name: "Name" });
	await expect(name).toBeFocused();
	expect(await name.evaluate((field: HTMLInputElement) => field.validationMessage)).toBe(
		"Bitte fülle dieses Feld aus.",
	);
	await name.fill("Ein Besucher");
	const email = form.getByRole("textbox", { exact: true, name: "E-Mail" });
	await email.fill("invalid");
	await form.getByRole("textbox", { exact: true, name: "Nachricht" }).fill("Hallo Jan");
	await submit.click();
	await expect(email).toBeFocused();
	expect(await email.evaluate((field: HTMLInputElement) => field.validationMessage)).toBe(
		"Bitte gib eine gültige E-Mail-Adresse ein.",
	);
});
