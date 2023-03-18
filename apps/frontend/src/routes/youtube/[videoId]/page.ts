export interface RequiredCommentInfo {
	textDisplay: string;
	authorDisplayName: string;
	authorProfileImageUrl: string;
	authorChannelUrl: string;
	likeCount: string;
	publishedAt: string;
}

export interface TopLevelCommentInfo extends RequiredCommentInfo {
	videoId: string;
	textOriginal: string;
	authorChannelId: {
		value: string;
	};
	canRate: string;
	viewerRating: string;
	updatedAt: string;
}

export interface TopLevelComment {
	kind: string;
	etag: string;
	id: string;
	snippet: TopLevelCommentInfo;
}

export interface Snippet {
	videoId: string;
	topLevelComment: TopLevelComment;
	canReply: string;
	totalReplyCount: number;
	isPublic: string;
}

export interface Item {
	kind: string;
	etag: string;
	id: string;
	snippet: Snippet;
}

export interface YoutubeCommentThreads {
	kind: string;
	etag: string;
	nextPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: Item[];
}
