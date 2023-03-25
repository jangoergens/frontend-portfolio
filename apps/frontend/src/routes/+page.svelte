<script lang="ts">
	import { goto } from '$app/navigation';

	let videoURL = '';

	const handleSubmit = () => {
		const url = new URL(videoURL);
		const videoId = url.searchParams.get('v');

		videoId ? goto(`/${videoId}`) : goto(url.pathname);
	};
</script>

<svelte:head>
	<title>TopCommentFinder - Beyond the Algorithm</title>
	<meta
		name="description"
		content="TopCommentFinder: Effortlessly discover the genuine top comments on any YouTube video. Enhance your viewing experience by accessing the best comments without relying on YouTube's default algorithm."
	/>
</svelte:head>

<section class="flex flex-col justify-center items-center gap-12">
	<div class="flex flex-col items-center">
		<h1>TopCommentFinder - Beyond the Algorithm</h1>
		<h2>Access top comments without YouTube's limitations.</h2>
	</div>
	<p>
		The existing YouTube comment algorithm may not cater to everyone's preferences, especially when
		browsing older videos. To address this, we've developed a user-friendly platform that enables
		you to effortlessly access the genuine top comments from any YouTube video. All you need to do
		is enter the video's link.
	</p>
	<form on:submit|preventDefault={handleSubmit}>
		<label for="videoSearch">Video URL: </label>
		<input
			class="border-2 border-black rounded"
			type="text"
			name="videoSearch"
			id="videoSearch"
			bind:value={videoURL}
		/>
		<button type="submit">Search</button>
	</form>

	<a href="/Y4iXIdg8b10"><button type="button">Example Video (few comments)</button></a>
	<a href="/2L2wEs2Cbdk"><button type="button">Example Video (many comments)</button></a>
</section>
