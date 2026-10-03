import { expect, test } from "@playwright/test";

test("contact form validates required fields and email before submitting", async ({ page }) => {
	await page.goto("/en#contact");
	const form = page.getByRole("form", { name: "Send Jan a message" });
	const submit = form.getByRole("button", { name: "Send message" });
	test.skip(await submit.isDisabled(), "No Formspree endpoint configured in this build.");
	await expect(form.locator('label[for="contact-name"]')).toHaveText("Name *");
	await expect(form.locator('label[for="contact-email"]')).toHaveText("Email *");
	await submit.click();
	await expect(form.getByRole("textbox", { exact: true, name: "Name" })).toBeFocused();
	await form.getByRole("textbox", { exact: true, name: "Name" }).fill("A visitor");
	await form.getByRole("textbox", { exact: true, name: "Email" }).fill("not-an-email");
	await form.getByRole("textbox", { exact: true, name: "Message" }).fill("Hello Jan");
	await submit.click();
	await expect(form.getByRole("textbox", { exact: true, name: "Email" })).toBeFocused();
	await expect(page).toHaveURL(/#contact$/);
});

for (const locale of ["de", "en"]) {
	for (const javaScriptEnabled of [true, false]) {
		test(`${locale} contact form submits to Formspree with JavaScript ${javaScriptEnabled ? "enabled" : "disabled"}`, async ({
			browser,
		}) => {
			const context = await browser.newContext({ javaScriptEnabled, reducedMotion: "reduce" });
			let submitted: undefined | URLSearchParams;
			await context.route("https://formspree.io/**", async (route) => {
				expect(route.request().method()).toBe("POST");
				submitted = new URLSearchParams(route.request().postData() ?? "");
				await route.fulfill({ body: "<h1>Message received</h1>", contentType: "text/html" });
			});
			try {
				const page = await context.newPage();
				await page.goto(`/${locale}#contact`);
				const form = page.getByRole("form", {
					name: locale === "de" ? "Jan eine Nachricht senden" : "Send Jan a message",
				});
				const submit = form.getByRole("button", {
					name: locale === "de" ? "Nachricht senden" : "Send message",
				});
				test.skip(await submit.isDisabled(), "No Formspree endpoint configured in this build.");
				await form.getByRole("textbox", { exact: true, name: "Name" }).fill("A visitor");
				await form
					.getByRole("textbox", { exact: true, name: locale === "de" ? "E-Mail" : "Email" })
					.fill("visitor@example.com");
				await form
					.getByRole("textbox", { exact: true, name: locale === "de" ? "Nachricht" : "Message" })
					.fill("We met at a conference.\nLet's talk.");
				await submit.click();
				await expect(page.getByRole("heading", { name: "Message received" })).toBeVisible();
				await expect(page).toHaveURL(/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/);
				expect(submitted?.get("name")).toBe("A visitor");
				expect(submitted?.get("email")).toBe("visitor@example.com");
				expect(submitted?.get("message")).toBe("We met at a conference.\r\nLet's talk.");
				expect(submitted?.get("_gotcha")).toBe("");
			} finally {
				await context.close();
			}
		});
	}
}

for (const locale of ["de", "en"]) {
	test(`${locale} unconfigured contact form keeps LinkedIn available and disables submission`, async ({
		page,
	}) => {
		await page.goto(`/${locale}#contact`);
		const form = page.getByRole("form", {
			name: locale === "de" ? "Jan eine Nachricht senden" : "Send Jan a message",
		});
		test.skip(!!(await form.getAttribute("action")), "This build has a Formspree endpoint.");
		await expect(
			form.getByRole("button", { name: locale === "de" ? "Nachricht senden" : "Send message" }),
		).toBeDisabled();
		await expect(form).toContainText(
			locale === "de"
				? "Das Formular ist derzeit nicht verfügbar."
				: "The form is currently unavailable.",
		);
		await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
	});
}
