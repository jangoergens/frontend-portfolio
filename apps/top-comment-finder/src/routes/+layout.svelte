<script lang="ts">
	import Footer from "$lib/footer/Footer.svelte";
	import Header from "$lib/header/Header.svelte";
	import { onMount } from "svelte";

	import "../app.css";
	import { getUserThemePreference } from "../utils/helper";

	onMount(() => {
		if (getUserThemePreference() === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	});
</script>

<Header />

<main class="px-4 py-4 lg:px-40">
	<slot />
</main>

<Footer />
