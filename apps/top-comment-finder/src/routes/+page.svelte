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

<section class="flex flex-col items-center justify-center">
	<h1 class="text-center text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
		TopCommentFinder - <span
			class="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 bg-clip-text text-transparent"
			>Beyond the Algorithm</span
		>
	</h1>
	<h2 class="text-center italic text-slate-500">
		Access top comments without YouTube's limitations
	</h2>
	<form
		class="my-8 flex w-full items-center gap-2 py-8 sm:w-2/3 lg:max-w-xl"
		on:submit|preventDefault={handleSubmit}
	>
		<input
			bind:value={videoUrl}
			class="h-10 w-5/6 rounded-full border-2 border-black px-2 text-center"
			id="videoSearch"
			name="videoSearch"
			placeholder="Paste YouTube Video URL"
			type="text"
		/>
		<button class="h-9 py-1" title="Search" type="submit"
			><img alt="Search Icon" class="fill-white" height="28" src={searchIcon} width="28" /></button
		>
	</form>

	<div class="flex flex-col gap-4 text-center font-semibold sm:w-2/3 md:w-1/2 xl:w-2/5">
		<p>
			The existing YouTube comment-sorting algorithm may not cater to everyone's preferences,
			particularly when browsing older videos.
		</p>
		<p>
			To address this issue, I've developed a user-friendly platform that enables you to
			effortlessly access the genuine top comments from any YouTube video. All you need to do is
			enter the video's link.
		</p>
	</div>

	<a class="my-8" href="/czgOWmtGVGs"><button type="button">Give it a try!</button></a>
</section>
