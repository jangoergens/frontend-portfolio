import type { RequiredCommentInfo, YoutubeCommentThreads } from "$lib/types/youtubeApiTypes";

import { env } from "$env/dynamic/private";
import { type RequestEvent } from "@sveltejs/kit";

export async function GET({ params }: RequestEvent) {
	if (!params.videoId) {
		return new Response("No video ID provided.");
	}
	if (env.GOOGLE_API_MODE === "production") {
		const apiKey = env.GOOGLE_API_KEY;
		const MAX_RESULTS = 20;
		const MAX_COMMENT_THREAD_PAGES = 100;

		const fetchCommentThread = async (pageToken?: string) => {
			return await fetch(
				`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&videoId=${
					params.videoId
				}&key=${apiKey}&textFormat=plainText&maxResults=100${
					pageToken ? `&pageToken=${pageToken}` : ""
				}`,
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
						authorChannelUrl: commentThread.snippet.topLevelComment.snippet.authorChannelUrl,
						authorDisplayName: commentThread.snippet.topLevelComment.snippet.authorDisplayName,
						authorProfileImageUrl:
							commentThread.snippet.topLevelComment.snippet.authorProfileImageUrl,
						likeCount: commentThread.snippet.topLevelComment.snippet.likeCount,
						publishedAt: commentThread.snippet.topLevelComment.snippet.publishedAt,
						textDisplay: commentThread.snippet.topLevelComment.snippet.textDisplay,
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
		} while (commentThreads?.nextPageToken && currentCommentThreadPage < MAX_COMMENT_THREAD_PAGES);

		return new Response(JSON.stringify(topComments));
	} else if (env.GOOGLE_API_MODE === "development") {
		const randomComments: RequiredCommentInfo[] = [
			{
				authorChannelUrl: "https://www.youtube.com/channel/UC73JBYrwukH8T8KTia7GqUQ",
				authorDisplayName: "Rupert",
				authorProfileImageUrl:
					"https://yt3.googleusercontent.com/ytc/APkrFKY7Vu_vJ-pdONXwecBHQYTB9HHRXoodxs3HJvepSw=s176-c-k-c0x00ffffff-no-rj",
				likeCount: "0",
				publishedAt: "2023-03-17T09:22:07Z",
				textDisplay: "This video was so informative, thank you for sharing!",
			},
			{
				authorChannelUrl: "http://www.youtube.com/channel/UCgV0uu8xZaMvHh2KCkuxM9Q",
				authorDisplayName: "Schoko-PetraHDDD",
				authorProfileImageUrl:
					"https://yt3.ggpht.com/ytc/AL5GRJVrLn0_v6na09Xgcihe3cozSusC1pWdLbLm=s48-c-k-c0x00ffffff-no-rj",
				likeCount: "1",
				publishedAt: "2023-03-17T11:26:02Z",
				textDisplay: "The cinematography in this video is stunning!",
			},
			{
				authorChannelUrl: "http://www.youtube.com/channel/UClLFg97nBIWbLdT2VZPQELg",
				authorDisplayName: "Calciumchlorid",
				authorProfileImageUrl:
					"https://yt3.googleusercontent.com/ytc/APkrFKazjspTLHbTa_xqqWFD1M76QXYd2GDYtyJhEoFq=s176-c-k-c0x00ffffff-no-rj",
				likeCount: "3",
				publishedAt: "2023-03-17T12:45:00Z",
				textDisplay: "I just found your channel and I love your content!",
			},
			{
				authorChannelUrl: "https://www.youtube.com/channel/UCKmj57RRLKy_v2e1vadLeDw",
				authorDisplayName: "Studio23 Media",
				authorProfileImageUrl:
					"https://yt3.googleusercontent.com/ytc/APkrFKbFAdhXEE-J--qiGcylcfew2Jw38tfDouCxu0csog=s176-c-k-c0x00ffffff-no-rj",
				likeCount: "20",
				publishedAt: "2023-03-21T09:30:00Z",
				textDisplay: "Amazing video, really helped me understand the topic!",
			},
			{
				authorChannelUrl: "https://www.youtube.com/channel/UCMLShsxixseJQyB6lRfqZxQ",
				authorDisplayName: "Fred Hollingsworth",
				authorProfileImageUrl:
					"https://yt3.googleusercontent.com/ytc/APkrFKbl9twHpBJ6Xol7MpKH8hXynfFB3wAgR1SFVRVJrw=s176-c-k-c0x00ffffff-no-rj",
				likeCount: "7",
				publishedAt: "2023-03-18T15:00:00Z",
				textDisplay: "Your editing skills are on point 👌",
			},
			{
				authorChannelUrl: "https://invalid-url.com",
				authorDisplayName: "Invalid Demo User",
				authorProfileImageUrl: "https://invalid-url.com",
				likeCount: "12",
				publishedAt: "2023-03-20T11:15:00Z",
				textDisplay: "Keep up the great work, can't wait for the next video!",
			},
		].sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
		return new Response(JSON.stringify(randomComments));
	} else {
		console.error(
			"Error: Supabase client not found or API mode not set to development or production.",
		);
	}
}
