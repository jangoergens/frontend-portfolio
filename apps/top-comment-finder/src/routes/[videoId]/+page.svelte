<script lang="ts">
	import { page } from "$app/state";

	import type { RequiredCommentInfo } from "#lib/types/youtubeApiTypes.ts";

	import avatar from "#lib/assets/avatar.svg";
	import thumbsUp from "#lib/assets/thumbsUp.svg";

	const videoId = $derived(page.params.videoId);
	let partialResults = $state(false);
	const fetchComments = async () => {
		const response = await fetch(`/api/comments/${videoId}`);

		if (!response.ok) {
			const messages: Record<number, string> = {
				400: "This YouTube video link is invalid.",
				429: "Too many requests. Please wait a minute before trying again.",
				503: "The comment service is busy or temporarily unavailable. Please try again later.",
				504: "Fetching comments took too long. Please try again later.",
			};
			throw new Error(
				messages[response.status] ?? "Unable to load comments. Please try again later.",
			);
		}
		partialResults = response.headers.get("X-Comments-Partial") === "true";
		return response.json() as Promise<RequiredCommentInfo[]>;
	};

	function shortenNumber(num: number): string {
		if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(1) + "M";
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(1) + "K";
		} else {
			return num.toString();
		}
	}
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1>Selected Video</h1>
	<iframe
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
		class="aspect-video w-full md:max-w-xl"
		src={"https://www.youtube.com/embed/" + videoId}
		title="YouTube video player"
	></iframe>

	{#await fetchComments()}
		<p class="animate-pulse">...loading comments</p>
	{:then comments}
		<div class="flex flex-col items-center">
			<h2>Top Comments for this Video</h2>
			<h3>{comments.length}/20 comments</h3>
			{#if partialResults}
				<p>Showing the most liked comments from a limited sample of this video's comments.</p>
			{/if}
		</div>
		<ol class="flex w-full flex-col items-center gap-4">
			{#each comments as comment, index (index)}
				<li
					class="flex w-full items-center gap-2 rounded-lg border-2 border-gray-200 bg-white p-2 shadow-xs md:w-3/4 lg:w-[56rem] dark:border-zinc-400 dark:bg-zinc-800"
				>
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- External YouTube profile URL. -->
					<a href={comment.authorChannelUrl}>
						<object
							class="rounded-full"
							data={comment.authorProfileImageUrl}
							height="32"
							title={"Profile Picture of " + comment.authorDisplayName}
							type="image/jpeg"
							width="32"
						>
							<img
								alt="generic user avatar"
								class="rounded-full"
								height="32"
								src={avatar}
								width="32"
							/>
						</object>
					</a>
					<div class="flex w-5/6 flex-col break-words">
						<span>{comment.textDisplay}</span>
						<div>
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- External YouTube profile URL. -->
							<a class="text-sm font-semibold" href={comment.authorChannelUrl}
								>by {comment.authorDisplayName}</a
							>
							<span class="text-sm"
								>({new Date(comment.publishedAt).toLocaleDateString("de-DE")})</span
							>
						</div>
					</div>
					<div class="ml-auto flex w-8 flex-col items-center justify-center">
						<img
							alt="Thumbs Up"
							class="max-w-none dark:invert"
							height="16"
							src={thumbsUp}
							width="16"
						/>
						<span>{shortenNumber(Number(comment.likeCount))}</span>
					</div>
				</li>
			{/each}
		</ol>
	{:catch error}
		<p>An error occurred!</p>
		<p>{error.message}</p>
	{/await}
</div>
