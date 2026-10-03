<script lang="ts">
	import { page } from "$app/state";

	import { getLocale, translations } from "#lib/i18n.ts";

	let copy = $derived(translations[getLocale(page.params.lang)].navigation);
</script>

<footer class="site-footer">
	<span>© {new Date().getFullYear()} Jan Görgens</span>
	<a href="#top">{copy.backToTop}</a>
</footer>
