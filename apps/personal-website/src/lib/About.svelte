<script lang="ts">
	import { page } from "$app/state";

	import { getLocale, localizedPath, translations } from "#lib/i18n.ts";

	let locale = $derived(getLocale(page.params.lang));
	let copy = $derived(translations[locale]);
</script>

<svelte:head>
	<title>{copy.about.pageTitle}</title>
	<meta name="description" content={copy.about.description} />
	<meta property="og:title" content={copy.about.pageTitle} />
	<meta property="og:description" content={copy.about.description} />
	<meta property="og:type" content="website" />
</svelte:head>

<section class="standalone-about">
	<h1>{copy.about.title}</h1>
	<p class="intro-lead">
		{copy.about.introBefore}
		<a href="https://plancraft.com" target="_blank" rel="noopener noreferrer">plancraft</a>{copy
			.about.introAfter}
	</p>
	<p>{copy.about.agents}</p>
	<p>{copy.about.approach}</p>
	<p>
		{copy.about.projectBefore}
		<a href="https://topcomments.jangoergens.de" target="_blank" rel="noopener noreferrer"
			>TopComments</a
		>{copy.about.projectAfter}
	</p>
	<a class="text-link" href={`${localizedPath(locale, "/")}#contact`}
		>{copy.navigation.getInTouch}</a
	>
</section>
