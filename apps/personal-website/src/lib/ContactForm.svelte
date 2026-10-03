<script lang="ts">
	import { page } from "$app/state";

	import { getLocale, translations } from "#lib/i18n.ts";

	let { endpoint }: { endpoint: string } = $props();
	let copy = $derived(translations[getLocale(page.params.lang)].contact);

	function validate(event: Event) {
		const field = event.currentTarget as HTMLInputElement | HTMLTextAreaElement;
		field.setCustomValidity("");
		if (field.validity.valueMissing) field.setCustomValidity(copy.required);
		else if (field.validity.typeMismatch) field.setCustomValidity(copy.invalidEmail);
	}
</script>

<form class="contact-form" action={endpoint || undefined} method="post" aria-label={copy.formLabel}>
	<div class="form-row">
		<label for="contact-name"
			>{copy.name} <span aria-hidden="true">*</span>
			<input
				id="contact-name"
				name="name"
				autocomplete="name"
				maxlength="100"
				required
				oninvalid={validate}
				oninput={validate}
			/>
		</label>
		<label for="contact-email"
			>{copy.email} <span aria-hidden="true">*</span>
			<input
				id="contact-email"
				name="email"
				type="email"
				autocomplete="email"
				maxlength="254"
				required
				oninvalid={validate}
				oninput={validate}
			/>
		</label>
	</div>
	<label for="contact-message"
		>{copy.message} <span aria-hidden="true">*</span>
		<textarea
			id="contact-message"
			name="message"
			rows="5"
			maxlength="10000"
			required
			oninvalid={validate}
			oninput={validate}></textarea>
	</label>
	<div class="form-honeypot" aria-hidden="true">
		<label for="contact-website"
			>{copy.honeypot}
			<input id="contact-website" name="_gotcha" tabindex="-1" autocomplete="off" />
		</label>
	</div>
	<button class="form-submit" type="submit" disabled={!endpoint}>{copy.submit}</button>
	{#if endpoint}
		<p class="form-note">
			{copy.noteBefore}
			<a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer"
				>Formspree</a
			>
			{copy.noteAfter}
		</p>
	{:else}
		<p class="form-note">{copy.unavailable}</p>
	{/if}
</form>
