<script lang="ts">
	import { goto } from "$app/navigation";
	import searchIcon from "$lib/assets/searchWhite.svg?w=28&h=28&format=webp&imagetools";

	let videoUrl = "";

	const handleSubmit = async () => {
		const videoUrlPattern =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

		const urlMatch = videoUrl.match(videoUrlPattern);
		const idMatch = videoUrl.match(videoIdPattern);

		if (urlMatch) {
			await goto(`/${urlMatch[1]}`);
		} else if (idMatch) {
			await goto(`/${idMatch[0]}`);
		} else {
			alert("Invalid YouTube video URL");
		}
	};
</script>

<svelte:head>
	<title>TopCommentFinder - Beyond the Algorithm</title>
	<meta
		content="TopCommentFinder: Effortlessly discover the genuine top comments on any YouTube video. Enhance your viewing experience by accessing the best comments without relying on YouTube's default algorithm."
		name="description"
	/>
</svelte:head>

<section class="flex h-full flex-col">
	<h1 class="text-center text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
		TopCommentFinder - <span
			class="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 bg-clip-text text-transparent"
			>Beyond the Algorithm</span
		>
	</h1>
	<h2 class="text-center italic text-slate-500">
		Access top comments without YouTube's limitations
	</h2>

	<div class="my-auto mt-8 flex flex-col items-center">
		<form
			class="flex w-full max-w-xl items-center gap-2 py-8 lg:max-w-2xl"
			on:submit|preventDefault={handleSubmit}
		>
			<input
				bind:value={videoUrl}
				class="h-10 w-full rounded-full border-2 border-black bg-white px-2 text-center lg:h-12 dark:border-zinc-400 dark:bg-zinc-800"
				id="videoSearch"
				name="videoSearch"
				placeholder="Paste YouTube Video URL"
				type="text"
			/>
			<button class="h-9 w-12 lg:h-11 lg:w-12" title="Search" type="submit"
				><img alt="Search Icon" class="fill-white" src={searchIcon} /></button
			>
		</form>

		<p class="max-w-lg text-center font-semibold lg:max-w-xl">
			Get the top 20 most upvoted comments from any YouTube video. This tool ranks comments by
			initial upvotes, not date. Paste a link to use.
		</p>

		<a class="my-8" href="/czgOWmtGVGs"><button type="button">Give it a try!</button></a>
	</div>
</section>
