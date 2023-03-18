import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { RequiredCommentInfo, YoutubeCommentThreads } from '../../../youtube/[videoId]/page';

export async function GET({ params }: RequestEvent) {
	if (env.GOOGLE_API_MODE === 'production') {
		const apiKey = env.GOOGLE_API_KEY;

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${params.videoId}&key=${apiKey}&textFormat=plainText&maxResults=100`
		);

		if (response.ok) {
			const commentThreads: YoutubeCommentThreads = await response.json();
			const topLevelComments: RequiredCommentInfo[] = commentThreads.items.map((comment) => {
				return {
					textDisplay: comment.snippet.topLevelComment.snippet.textDisplay,
					authorDisplayName: comment.snippet.topLevelComment.snippet.authorDisplayName,
					authorProfileImageUrl: comment.snippet.topLevelComment.snippet.authorProfileImageUrl,
					authorChannelUrl: comment.snippet.topLevelComment.snippet.authorChannelUrl,
					likeCount: comment.snippet.topLevelComment.snippet.likeCount,
					publishedAt: comment.snippet.topLevelComment.snippet.publishedAt
				};
			});

			return new Response(JSON.stringify(topLevelComments));
		} else {
			return new Response(JSON.stringify(response.text()));
		}
	}
	if (env.GOOGLE_API_MODE === 'development') {
		const randomComments: RequiredCommentInfo[] = [
			{
				textDisplay: 'This video was so informative, thank you for sharing!',
				authorDisplayName: 'InfoSeeker',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJUHXLtTVSMbXWeiP721qiXcmdKuxt6aoy5auNO8=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg',
				likeCount: '0',
				publishedAt: '2023-03-17T09:22:07Z'
			},
			{
				textDisplay: 'The cinematography in this video is stunning!',
				authorDisplayName: 'VisualAdmirer',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJVrLn0_v6na09Xgcihe3cozSusC1pWdLbLm=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UCgV0uu8xZaMvHh2KCkuxM9Q',
				likeCount: '1',
				publishedAt: '2023-03-17T11:26:02Z'
			},
			{
				textDisplay: 'I just found your channel and I love your content!',
				authorDisplayName: 'NewSubscriber',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJUHXLtTVSMbXWeiP721qiXcmdKuxt6aoy5auNO8=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg',
				likeCount: '3',
				publishedAt: '2023-03-17T12:45:00Z'
			}
		].sort((a, b) => (Number(a.likeCount) < Number(b.likeCount) ? 1 : -1));
		return new Response(JSON.stringify(randomComments));
	}
}
