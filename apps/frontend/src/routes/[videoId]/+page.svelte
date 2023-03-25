<script lang="ts">
	import { page } from '$app/stores';
	import type { RequiredCommentInfo } from './page';
	import thumbsUp from '$lib/assets/thumbsUp.svg';
	import avatar from '$lib/assets/avatar.svg';

	const videoId = $page.params.videoId;
	const fetchComments = async (): Promise<RequiredCommentInfo[]> => {
		const response = await fetch(`/api/comments/${videoId}`);

		return await response.json();
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

<div class="flex justify-center items-center flex-col gap-4">
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
		<ol class="flex flex-col gap-4 items-center w-full">
			{#each comments as comment}
				<li
					class="border-2 rounded-lg p-2 flex gap-2 w-full md:w-1/2 items-center bg-white shadow-sm"
				>
					<a href={comment.authorChannelUrl} class="w-8">
						<object
							data={comment.authorProfileImageUrl}
							type="image/jpeg"
							title={'Profile Picture of ' + comment.authorDisplayName}
							class="rounded-full w-full"
						>
							<img src={avatar} alt="generic user avatar" class="rounded-full" />
						</object>
					</a>
					<div class="flex flex-col break-words w-5/6">
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
					<div class="flex flex-col justify-center ml-auto w-8 items-center">
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
