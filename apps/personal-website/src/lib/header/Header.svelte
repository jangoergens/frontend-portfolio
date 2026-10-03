<script lang="ts">
	import { page } from "$app/state";
	import { onMount } from "svelte";

	import { getLocale, type Locale, localizedPath, translations } from "#lib/i18n.ts";

	import { getUserThemePreference } from "../../utils/helper";

	let currentTheme = $state("light");
	let mounted = $state(false);
	let locale = $derived(getLocale(page.params.lang));
	let copy = $derived(translations[locale].navigation);
	let themeLabel = $derived(currentTheme === "light" ? copy.darkMode : copy.lightMode);
	let urlSuffix = $derived(mounted ? `${page.url.search}${page.url.hash}` : "");

	function rememberLanguage(language: Locale) {
		try {
			localStorage.setItem("language", language);
		} catch {
			// The language links still work when local storage is disabled.
		}
	}

	onMount(() => {
		mounted = true;
		currentTheme = getUserThemePreference();
		document.documentElement.classList.toggle("dark", currentTheme === "dark");
	});

	function toggleDarkMode() {
		currentTheme = currentTheme === "dark" ? "light" : "dark";
		document.documentElement.classList.toggle("dark", currentTheme === "dark");
		try {
			localStorage.setItem("theme", currentTheme);
		} catch {
			// The toggle still works when the browser disables local storage.
		}
	}
</script>

<header class="site-header">
	<a class="identity" href={localizedPath(locale, "/")} aria-label={copy.home}
		><span class="monogram" aria-hidden="true">jg<span>.</span></span><span>Jan Görgens</span></a
	>
	<div class="header-actions">
		<nav aria-label={copy.main}>
			<a href={`${localizedPath(locale, "/")}#work`}>{copy.work}</a><a
				href={`${localizedPath(locale, "/")}#about`}>{copy.about}</a
			><a href={`${localizedPath(locale, "/")}#contact`}>{copy.contact}</a>
		</nav>
		<div class="language-switch" role="group" aria-label={copy.language}>
			{#each ["de", "en"] as language (language)}
				<a
					href={`${localizedPath(getLocale(language), page.url.pathname)}${urlSuffix}`}
					hreflang={language}
					lang={language}
					aria-label={language === "de" ? "Deutsch" : "English"}
					aria-current={locale === language ? "true" : undefined}
					onclick={() => rememberLanguage(getLocale(language))}>{language.toUpperCase()}</a
				>
			{/each}
		</div>
		<button
			class="theme-toggle"
			aria-label={themeLabel}
			aria-pressed={currentTheme === "dark"}
			onclick={toggleDarkMode}
			title={themeLabel}
			><svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				width="20"
				height="20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				>{#if currentTheme === "light"}<path
						d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z"
					/>{:else}<circle cx="12" cy="12" r="4" /><path
						d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"
					/>{/if}</svg
			></button
		>
	</div>
</header>
