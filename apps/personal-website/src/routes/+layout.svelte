<script lang="ts">
	import Footer from "$lib/footer/Footer.svelte";
	import Header from "$lib/header/Header.svelte";
	import { onMount } from "svelte";

	import "../app.css";
	import { getUserThemePreference } from "../utils/helper";
	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();

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
	{@render children?.()}
</main>

<Footer />
