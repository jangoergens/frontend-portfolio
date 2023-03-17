import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import type { TopLevelCommentInfo, YoutubeCommentThreads } from '../../../youtube/[videoId]/page';

export async function GET({ params }: RequestEvent) {
	if (env.NODE_ENV === 'production') {
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
	if (env.NODE_ENV === 'development') {
		const randomComments: TopLevelCommentInfo[] = [
			{
				videoId: 'Y4iXIdg8b10',
				textDisplay: 'This video was so informative, thank you for sharing!',
				textOriginal: 'This video was so informative, thank you for sharing!',
				authorDisplayName: 'InfoSeeker',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJUHXLtTVSMbXWeiP721qiXcmdKuxt6aoy5auNO8=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg',
				authorChannelId: { value: 'UClLFg97nBIWbLdT2VZPQELg' },
				canRate: true,
				viewerRating: 'none',
				likeCount: 0,
				publishedAt: new Date('2023-03-17T09:22:07Z'),
				updatedAt: new Date('2023-03-17T09:22:07Z')
			},
			{
				videoId: 'Y4iXIdg8b10',
				textDisplay: 'The cinematography in this video is stunning!',
				textOriginal: 'The cinematography in this video is stunning!',
				authorDisplayName: 'VisualAdmirer',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJVrLn0_v6na09Xgcihe3cozSusC1pWdLbLm=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UCgV0uu8xZaMvHh2KCkuxM9Q',
				authorChannelId: { value: 'UCgV0uu8xZaMvHh2KCkuxM9Q' },
				canRate: true,
				viewerRating: 'none',
				likeCount: 1,
				publishedAt: new Date('2023-03-17T11:26:02Z'),
				updatedAt: new Date('2023-03-17T11:26:02Z')
			},
			{
				videoId: 'Y4iXIdg8b10',
				textDisplay: 'I just found your channel and I love your content!',
				textOriginal: 'I just found your channel and I love your content!',
				authorDisplayName: 'NewSubscriber',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJUHXLtTVSMbXWeiP721qiXcmdKuxt6aoy5auNO8=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg',
				authorChannelId: { value: 'UClLFg97nBIWbLdT2VZPQELg' },
				canRate: true,
				viewerRating: 'none',
				likeCount: 3,
				publishedAt: new Date('2023-03-17T12:45:00Z'),
				updatedAt: new Date('2023-03-17T12:45:00Z')
			}
		];
		return new Response(JSON.stringify(randomComments));
	}
}
