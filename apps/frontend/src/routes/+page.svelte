<script lang="ts">
	import { goto } from '$app/navigation';
	import searchIcon from '$lib/assets/searchWhite.svg';

	let videoURL = '';

	const handleSubmit = () => {
		const formatedURL =
			videoURL.startsWith('https://') || videoURL.startsWith('http://')
				? videoURL
				: 'https://' + videoURL;
		const url = new URL(formatedURL);

		const videoId = url.searchParams.get('v');
		videoId ? goto(`/${videoId}`) : goto(`/${url.pathname.replaceAll('/', '')}`);
	};
</script>

<svelte:head>
	<title>TopCommentFinder - Beyond the Algorithm</title>
	<meta
		name="description"
		content="TopCommentFinder: Effortlessly discover the genuine top comments on any YouTube video. Enhance your viewing experience by accessing the best comments without relying on YouTube's default algorithm."
	/>
</svelte:head>

<section class="flex flex-col justify-center items-center">
	<h1 class="font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
		TopCommentFinder - <span
			class="from-orange-500 via-yellow-500 to-green-500 text-transparent bg-clip-text bg-gradient-to-r"
			>Beyond the Algorithm</span
		>
	</h1>
	<h2 class="text-center italic text-slate-500">
		Access top comments without YouTube's limitations
	</h2>
	<form
		on:submit|preventDefault={handleSubmit}
		class="my-8 w-full sm:w-2/3 lg:max-w-xl py-8 flex gap-2 items-center"
	>
		<input
			class="border-2 border-black rounded-full h-10 px-2 w-5/6 text-center"
			type="text"
			name="videoSearch"
			id="videoSearch"
			placeholder="Paste YouTube Video URL"
			bind:value={videoURL}
		/>
		<button type="submit" title="Search" class="h-9 py-1"
			><img src={searchIcon} alt="Search Icon" class="h-full fill-white" /></button
		>
	</form>

	<div class="flex flex-col sm:w-2/3 md:w-1/2 xl:w-2/5  gap-4 text-center font-semibold ">
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

	<a href="/czgOWmtGVGs" class="my-8"><button type="button">Give it a try!</button></a>
</section>
