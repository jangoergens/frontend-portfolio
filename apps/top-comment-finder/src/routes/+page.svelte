<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";

	import searchIcon from "#lib/assets/searchWhite.svg";

	let videoUrl = $state("");

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const videoUrlPattern =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

		const urlMatch = videoUrl.match(videoUrlPattern);
		const idMatch = videoUrl.match(videoIdPattern);

		if (urlMatch) {
			await goto(resolve("/[videoId]", { videoId: urlMatch[1] }));
		} else if (idMatch) {
			await goto(resolve("/[videoId]", { videoId: idMatch[0] }));
		} else {
			alert("Invalid YouTube video URL");
		}
	};
</script>

<svelte:head>
	<title>TopCommentFinder - Beyond the Algorithm</title>
	<meta
		content="Explore YouTube comments sorted by likes. Paste a video link to see up to 20 of the most-liked comments retrieved by TopCommentFinder."
		name="description"
	/>
</svelte:head>

<section class="flex h-full flex-col">
	<h1 class="text-center text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
		TopCommentFinder - <span
			class="bg-linear-to-r/srgb from-orange-500 via-yellow-500 to-green-500 bg-clip-text text-transparent"
			>Beyond the Algorithm</span
		>
	</h1>
	<h2 class="text-center text-slate-500 italic">Explore YouTube comments, sorted by likes</h2>

	<div class="my-auto mt-8 flex flex-col items-center">
		<form class="flex w-full max-w-xl items-center gap-2 py-8 lg:max-w-2xl" onsubmit={handleSubmit}>
			<input
				bind:value={videoUrl}
				class="h-10 w-full rounded-full border-2 border-black bg-white px-2 text-center lg:h-12 dark:border-zinc-400 dark:bg-zinc-800"
				id="videoSearch"
				name="videoSearch"
				placeholder="Paste YouTube Video URL"
				type="text"
			/>
			<button aria-label="Search" class="h-9 w-12 lg:h-11 lg:w-12" title="Search" type="submit"
				><img
					alt="Search Icon"
					class="fill-white"
					height="28"
					src={searchIcon}
					width="28"
				/></button
			>
		</form>

		<p class="max-w-lg text-center font-semibold lg:max-w-xl">
			Paste a YouTube video link to see up to 20 of the most-liked comments we find, sorted by like
			count. Videos with many comments may show a sample.
		</p>

		<a class="my-8" href={resolve("/[videoId]", { videoId: "czgOWmtGVGs" })}
			><button type="button">Give it a try!</button></a
		>
	</div>
</section>
