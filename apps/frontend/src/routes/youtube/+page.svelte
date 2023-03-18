<script lang="ts">
	import { goto } from '$app/navigation';

	let videoURL = '';

	const handleSubmit = () => {
		const url = new URL(videoURL);
		const videoId = url.searchParams.getAll('v');
		goto(`/youtube/${videoId}`);
	};
</script>

<svelte:head>
	<title>Youtube Video Selector</title>
	<meta name="description" content="Youtube Video Selection" />
</svelte:head>

<section class="flex flex-col justify-center items-center gap-12">
	<div class="flex flex-col items-center">
		<h1>Youtube Video Selector</h1>
		<p>You can submit the link to a youtube video of which you want to see the top comments.</p>
	</div>
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

	<a href="/youtube/Y4iXIdg8b10"><button type="button">Example Video (few comments)</button></a>
	<a href="/youtube/2L2wEs2Cbdk"><button type="button">Example Video (many comments)</button></a>
</section>
