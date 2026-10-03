<script lang="ts">
	import { page } from "$app/state";

	import Footer from "#lib/footer/Footer.svelte";
	import Header from "#lib/header/Header.svelte";
	import { getLocale, translations } from "#lib/i18n.ts";
	import LocalizedHead from "#lib/LocalizedHead.svelte";

	import "../app.css";

	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
	let locale = $derived(getLocale(page.params.lang));
	let copy = $derived(translations[locale]);

	$effect(() => {
		document.documentElement.lang = locale;
	});
</script>

<LocalizedHead />
<a class="skip-link" href="#main">{copy.navigation.skip}</a>
<div class="site-shell" id="top">
	<Header />
	<main id="main" tabindex="-1">{@render children?.()}</main>
	<Footer />
</div>
