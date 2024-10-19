<script lang="ts">
	import type { RequiredCommentInfo } from "$lib/types/youtubeApiTypes";

	import { page } from "$app/stores";
	import avatar from "$lib/assets/avatar.svg?w=32&h=32&format=webp&imagetools";
	import thumbsUp from "$lib/assets/thumbsUp.svg?w=16&h=16&format=webp&imagetools";

	const videoId = $page.params.videoId;
	const fetchComments = async () => {
		const response = await fetch(`/api/comments/${videoId}`);

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
		</div>
		<ol class="flex w-full flex-col items-center gap-4">
			{#each comments as comment}
				<li
					class="flex w-full items-center gap-2 rounded-lg border-2 bg-white p-2 shadow-sm md:w-3/4 lg:w-[56rem] dark:border-zinc-400 dark:bg-zinc-800"
				>
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
