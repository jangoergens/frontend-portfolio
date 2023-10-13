<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Header from '$lib/header/Header.svelte';

	import '../app.css';
</script>

<Header />

<main class="px-4 py-4 lg:px-40">
	<slot />
</main>

<Footer />
