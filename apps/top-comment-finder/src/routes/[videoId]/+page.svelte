<script lang="ts">
	import { page } from '$app/stores';
	import thumbsUp from '$lib/assets/thumbsUp.svg';
	import avatar from '$lib/assets/avatar.svg';
	import type { RequiredCommentInfo } from '$lib/types/youtubeApiTypes';

	const videoId = $page.params.videoId;
	const fetchComments = async () => {
		const response = await fetch(`/api/comments/${videoId}`);

		return response.json() as Promise<RequiredCommentInfo[]>;
	};

	function shortenNumber(num: number): string {
		if (num >= 1_000_000) {
			return (num / 1_000_000).toFixed(1) + 'M';
		} else if (num >= 1_000) {
			return (num / 1_000).toFixed(1) + 'K';
		} else {
			return num.toString();
		}
	}
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<h1>Selected Video</h1>
	<iframe
		class="aspect-video w-full md:max-w-xl"
		src={'https://www.youtube.com/embed/' + videoId}
		title="YouTube video player"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
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
					class="flex w-full items-center gap-2 rounded-lg border-2 bg-white p-2 shadow-sm md:w-1/2"
				>
					<a href={comment.authorChannelUrl} class="w-8">
						<object
							data={comment.authorProfileImageUrl}
							type="image/jpeg"
							title={'Profile Picture of ' + comment.authorDisplayName}
							class="w-full rounded-full"
						>
							<img src={avatar} alt="generic user avatar" class="rounded-full" />
						</object>
					</a>
					<div class="flex w-5/6 flex-col break-words">
						<span>{comment.textDisplay}</span>
						<div>
							<a href={comment.authorChannelUrl} class="text-sm font-semibold"
								>by {comment.authorDisplayName}</a
							>
							<span class="text-sm"
								>({new Date(comment.publishedAt).toLocaleDateString('de-DE')})</span
							>
						</div>
					</div>
					<div class="ml-auto flex w-8 flex-col items-center justify-center">
						<img src={thumbsUp} alt="Thumbs Up" class="w-4 max-w-none" />
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
