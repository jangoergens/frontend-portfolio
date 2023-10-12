import { env } from '$env/dynamic/private';
import { supabase } from '$lib/supabaseClient';
import type { RequestEvent } from '@sveltejs/kit';
import type { RequiredCommentInfo, YoutubeCommentThreads } from '$lib/types/youtubeApiTypes';

export async function GET({ params }: RequestEvent) {
	if (!params.videoId) {
		return new Response('No video ID provided');
	}
	if (env.GOOGLE_API_MODE === 'production') {
		const { data } = await supabase.from('videos').select().eq('video_id', params.videoId);
		if (data && data[0]) {
			const { data } = await supabase.from('comments').select().eq('video_id', params.videoId);
			const topComments: RequiredCommentInfo[] = [];
			data?.map((comment) => {
				topComments.push({
					textDisplay: comment.text_display,
					authorDisplayName: comment.author_display_name,
					authorProfileImageUrl: comment.author_profile_image_url,
					authorChannelUrl: comment.author_channel_url,
					likeCount: comment.like_count,
					publishedAt: comment.published_at
				});
			});
			return new Response(
				JSON.stringify(topComments.sort((a, b) => Number(b.likeCount) - Number(a.likeCount)))
			);
		} else {
			await supabase.from('videos').insert({ video_id: params.videoId });
			const apiKey = env.GOOGLE_API_KEY;
			const MAX_RESULTS = 20;
			const MAX_COMMENT_THREAD_PAGES = 100;

			const fetchCommentThread = async (pageToken?: string) => {
				return await fetch(
					`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&videoId=${
						params.videoId
					}&key=${apiKey}&textFormat=plainText&maxResults=100${
						pageToken ? `&pageToken=${pageToken}` : ''
					}`
				);
			};

			let commentThreads: YoutubeCommentThreads | undefined;
			let currentCommentThreadPage = 0;
			const topComments: RequiredCommentInfo[] = [];

			do {
				const response = await fetchCommentThread(commentThreads?.nextPageToken);
				currentCommentThreadPage++;

				if (response.ok) {
					commentThreads = (await response.json()) as YoutubeCommentThreads;
					commentThreads?.items.map((commentThread) => {
						const topComment: RequiredCommentInfo = {
							textDisplay: commentThread.snippet.topLevelComment.snippet.textDisplay,
							authorDisplayName: commentThread.snippet.topLevelComment.snippet.authorDisplayName,
							authorProfileImageUrl:
								commentThread.snippet.topLevelComment.snippet.authorProfileImageUrl,
							authorChannelUrl: commentThread.snippet.topLevelComment.snippet.authorChannelUrl,
							likeCount: commentThread.snippet.topLevelComment.snippet.likeCount,
							publishedAt: commentThread.snippet.topLevelComment.snippet.publishedAt
						};
						if (topComments.length < MAX_RESULTS) {
							topComments.push(topComment);
							topComments.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
						} else if (topComment.likeCount > topComments[MAX_RESULTS - 1].likeCount) {
							topComments.pop();
							topComments.push(topComment);
							topComments.sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
						}
					});
				} else {
					return new Response(JSON.stringify(response.text()));
				}
			} while (
				commentThreads?.nextPageToken &&
				currentCommentThreadPage < MAX_COMMENT_THREAD_PAGES
			);
			await supabase.from('comments').insert(
				topComments.map((comment) => {
					return {
						video_id: params.videoId!,
						text_display: comment.textDisplay,
						author_display_name: comment.authorDisplayName,
						author_profile_image_url: comment.authorProfileImageUrl,
						author_channel_url: comment.authorChannelUrl,
						like_count: comment.likeCount,
						published_at: comment.publishedAt
					};
				})
			);

			return new Response(JSON.stringify(topComments));
		}
	} else if (env.GOOGLE_API_MODE === 'development') {
		const randomComments: RequiredCommentInfo[] = [
			{
				textDisplay: 'This video was so informative, thank you for sharing!',
				authorDisplayName: 'Rupert',
				authorProfileImageUrl:
					'https://yt3.googleusercontent.com/ytc/APkrFKY7Vu_vJ-pdONXwecBHQYTB9HHRXoodxs3HJvepSw=s176-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'https://www.youtube.com/channel/UC73JBYrwukH8T8KTia7GqUQ',
				likeCount: '0',
				publishedAt: '2023-03-17T09:22:07Z'
			},
			{
				textDisplay: 'The cinematography in this video is stunning!',
				authorDisplayName: 'Schoko-PetraHDDD',
				authorProfileImageUrl:
					'https://yt3.ggpht.com/ytc/AL5GRJVrLn0_v6na09Xgcihe3cozSusC1pWdLbLm=s48-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UCgV0uu8xZaMvHh2KCkuxM9Q',
				likeCount: '1',
				publishedAt: '2023-03-17T11:26:02Z'
			},
			{
				textDisplay: 'I just found your channel and I love your content!',
				authorDisplayName: 'Calciumchlorid',
				authorProfileImageUrl:
					'https://yt3.googleusercontent.com/ytc/APkrFKazjspTLHbTa_xqqWFD1M76QXYd2GDYtyJhEoFq=s176-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg',
				likeCount: '3',
				publishedAt: '2023-03-17T12:45:00Z'
			},
			{
				textDisplay: 'Amazing video, really helped me understand the topic!',
				authorDisplayName: 'Studio23 Media',
				authorProfileImageUrl:
					'https://yt3.googleusercontent.com/ytc/APkrFKbFAdhXEE-J--qiGcylcfew2Jw38tfDouCxu0csog=s176-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'https://www.youtube.com/channel/UCKmj57RRLKy_v2e1vadLeDw',
				likeCount: '20',
				publishedAt: '2023-03-21T09:30:00Z'
			},
			{
				textDisplay: 'Your editing skills are on point 👌',
				authorDisplayName: 'Fred Hollingsworth',
				authorProfileImageUrl:
					'https://yt3.googleusercontent.com/ytc/APkrFKbl9twHpBJ6Xol7MpKH8hXynfFB3wAgR1SFVRVJrw=s176-c-k-c0x00ffffff-no-rj',
				authorChannelUrl: 'https://www.youtube.com/channel/UCMLShsxixseJQyB6lRfqZxQ',
				likeCount: '7',
				publishedAt: '2023-03-18T15:00:00Z'
			},
			{
				textDisplay: "Keep up the great work, can't wait for the next video!",
				authorDisplayName: 'Invalid Demo User',
				authorProfileImageUrl: 'https://invalid-url.com',
				authorChannelUrl: 'https://invalid-url.com',
				likeCount: '12',
				publishedAt: '2023-03-20T11:15:00Z'
			}
		].sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
		return new Response(JSON.stringify(randomComments));
	}
}
