import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { YoutubeCommentThreads } from '../../../youtube/[videoId]/page';

export async function GET({ params }: RequestEvent) {
	const apiKey = env.GOOGLE_API_KEY;

	const response = await fetch(
		`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${params.videoId}&key=${apiKey}&textFormat=plainText&maxResults=100`
	);

	if (response.ok) {
		const commentThreads: YoutubeCommentThreads = await response.json();
		const topLevelComments = commentThreads.items.map(
			(comment) => comment.snippet.topLevelComment.snippet
		);

		return new Response(JSON.stringify(topLevelComments));
	} else {
		return new Response(JSON.stringify(response.text()));
	}
}
