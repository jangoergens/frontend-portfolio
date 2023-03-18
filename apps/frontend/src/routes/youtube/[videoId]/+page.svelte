<script lang="ts">
	import { page } from '$app/stores';
	import type { RequiredCommentInfo } from './page';
	import thumbsUp from '../../../images/thumbsUp.svg';

	const videoId = $page.params.videoId;
	const fetchComments = async (): Promise<RequiredCommentInfo[]> => {
		const response = await fetch(`/api/comments/${videoId}`);

		return await response.json();
	};
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
		<p>...loading comments</p>
	{:then comments}
		<h2>{comments.length} comments found</h2>
		<ol class="flex flex-col gap-4 items-center w-full">
			{#each comments as comment}
				<li class="border-2 rounded-md p-2 flex gap-2 w-1/2 items-center">
					<a href={comment.authorChannelUrl} class="w-8">
						<img
							src={comment.authorProfileImageUrl}
							alt={'Profile Picture of ' + comment.authorDisplayName}
							class="rounded-full"
						/>
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
					<div class="flex flex-col justify-center ml-auto w-6 items-center">
						<img src={thumbsUp} alt="Thumbs Up" class="w-4 max-w-none" />
						<span>{comment.likeCount}</span>
					</div>
				</li>
			{/each}
		</ol>
	{:catch error}
		<p>An error occurred!</p>
		<p>{error.message}</p>
	{/await}
</div>
