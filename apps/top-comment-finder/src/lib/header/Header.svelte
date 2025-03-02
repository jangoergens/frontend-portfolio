<script lang="ts">
	import { page } from "$app/stores";
	import logo from "$lib/assets/logo.png?w=48&h=48&format=webp&imagetools";
	import moon from "$lib/assets/moon.svg";
	import sun from "$lib/assets/sun.svg";
	import { onMount } from "svelte";

	import { getUserThemePreference } from "../../utils/helper";

	let currentTheme = $state("light");

	onMount(() => {
		currentTheme = getUserThemePreference();
	});

	function toggleDarkMode() {
		if (getUserThemePreference() === "dark") {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
		} else {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		}
		currentTheme = getUserThemePreference();
	}
</script>

<header class="flex h-16 flex-shrink-0 items-center justify-center">
	<a href="/">
		<img alt="TopCommentFinder Logo" height="48" src={logo} width="48" />
	</a>
	<nav data-sveltekit-preload-data>
		<ul class="flex h-12">
			<li class:active={$page.url.pathname === "/about"}>
				<a class="flex h-full items-center px-4 font-bold hover:text-orange-500" href="/about"
					>About</a
				>
			</li>
		</ul>
	</nav>
	<button
		class="bg-transparent hover:bg-transparent"
		onclick={toggleDarkMode}
		title={currentTheme === "light" ? "Enable Dark Mode" : "Enable Light Mode"}
	>
		<img
			alt={currentTheme === "light" ? "Sun Icon" : "Moon Icon"}
			height="24"
			src={currentTheme === "light" ? sun : moon}
			width="24"
		/>
	</button>
</header>
