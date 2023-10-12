<script lang="ts">
	import '../app.css';
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
</script>

<Header />

<main class="px-4 py-4 lg:px-40">
	<slot />
</main>

<Footer />
