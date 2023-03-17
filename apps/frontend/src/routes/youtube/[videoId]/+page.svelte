<script lang="ts">
	import { page } from '$app/stores';
	import type { TopLevelCommentInfo } from './page';

	const videoId = $page.params.videoId;
	const fetchComments = async (): Promise<TopLevelCommentInfo[]> => {
		const response = await fetch(`/api/comments/${videoId}`);
		return await response.json();
	};
</script>

<div class="flex justify-center items-center flex-col">
	<h1>Selected Video</h1>
	<iframe
		width="560"
		height="315"
		src={'https://www.youtube.com/embed/' + videoId}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
	{#await fetchComments()}
		<p>...loading comments</p>
	{:then comments}
		<h3>{comments.length} comments found</h3>
		<ol>
			{#each comments as comment}
				<li>{comment.textDisplay}</li>
			{/each}
		</ol>
	{:catch error}
		<p>An error occurred!</p>
		<p>{error.message}</p>
	{/await}
</div>
