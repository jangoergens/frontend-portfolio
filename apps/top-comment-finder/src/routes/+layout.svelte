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

<main class="h-fit p-4">
	<slot />
</main>

<Footer />
