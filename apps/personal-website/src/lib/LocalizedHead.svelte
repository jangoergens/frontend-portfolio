<script lang="ts">
	import { page } from "$app/state";

	import { getLocale, localizedPath } from "#lib/i18n.ts";

	let locale = $derived(getLocale(page.params.lang));
	let canonical = $derived(`https://jangoergens.de${localizedPath(locale, page.url.pathname)}`);
	let fallback = $derived(page.url.pathname.replace(/^\/(?:de|en)(?=\/|$)/, "") || "/");
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	<link
		rel="alternate"
		hreflang="de"
		href={`https://jangoergens.de${localizedPath("de", page.url.pathname)}`}
	/>
	<link
		rel="alternate"
		hreflang="en"
		href={`https://jangoergens.de${localizedPath("en", page.url.pathname)}`}
	/>
	<link rel="alternate" hreflang="x-default" href={`https://jangoergens.de${fallback}`} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={locale === "de" ? "de_DE" : "en_US"} />
	<meta property="og:locale:alternate" content={locale === "de" ? "en_US" : "de_DE"} />
</svelte:head>
