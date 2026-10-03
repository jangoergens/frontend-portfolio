import { GOOGLE_API_KEY, GOOGLE_API_MODE } from "$app/env/private";
import { type RequestEvent } from "@sveltejs/kit";

import type { RequiredCommentInfo, YoutubeCommentThreads } from "#lib/types/youtubeApiTypes.ts";

export async function GET({ fetch, params }: RequestEvent) {
	if (!params.videoId || !/^[a-zA-Z0-9_-]{11}$/.test(params.videoId)) {
		return Response.json({ error: "Invalid YouTube video ID." }, { status: 400 });
	}
	if (GOOGLE_API_MODE === "production") {
		const apiKey = GOOGLE_API_KEY;
		if (!apiKey) {
			return Response.json({ error: "YouTube API is not configured." }, { status: 503 });
		}
		const MAX_RESULTS = 20;
		const MAX_COMMENT_THREAD_PAGES = 100;

		const fetchCommentThread = (pageToken?: string) => {
			const url = new URL("https://www.googleapis.com/youtube/v3/commentThreads");
			url.search = new URLSearchParams({
				key: apiKey,
				maxResults: "100",
				order: "relevance",
				part: "snippet",
				textFormat: "plainText",
				videoId: params.videoId ?? "",
				...(pageToken ? { pageToken } : {}),
			}).toString();
			return fetch(url, { signal: AbortSignal.timeout(10000) });
		};

		let commentThreads: undefined | YoutubeCommentThreads;
		let currentCommentThreadPage = 0;
		const topComments: RequiredCommentInfo[] = [];

		do {
			let response: Response;
			try {
				response = await fetchCommentThread(commentThreads?.nextPageToken);
			} catch {
				return Response.json({ error: "Unable to contact YouTube." }, { status: 502 });
			}
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
				return Response.json({ error: "Unable to fetch comments from YouTube." }, { status: 502 });
			}
		} while (commentThreads?.nextPageToken && currentCommentThreadPage < MAX_COMMENT_THREAD_PAGES);

		return Response.json(topComments);
	} else if (GOOGLE_API_MODE === "development") {
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
		return Response.json(randomComments);
	} else {
		return Response.json({ error: "YouTube API mode is not configured." }, { status: 503 });
	}
}
