export interface CommentThread {
	etag: string;
	id: string;
	kind: string;
	snippet: Snippet;
}

export interface RequiredCommentInfo {
	authorChannelUrl: string;
	authorDisplayName: string;
	authorProfileImageUrl: string;
	likeCount: string;
	publishedAt: string;
	textDisplay: string;
}

export interface Snippet {
	canReply: string;
	isPublic: string;
	topLevelComment: TopLevelComment;
	totalReplyCount: number;
	videoId: string;
}

export interface TopLevelComment {
	etag: string;
	id: string;
	kind: string;
	snippet: TopLevelCommentInfo;
}

export interface TopLevelCommentInfo extends RequiredCommentInfo {
	authorChannelId: {
		value: string;
	};
	canRate: string;
	textOriginal: string;
	updatedAt: string;
	videoId: string;
	viewerRating: string;
}

export interface YoutubeCommentThreads {
	etag: string;
	items: CommentThread[];
	kind: string;
	nextPageToken: string;
	pageInfo: {
		resultsPerPage: number;
		totalResults: number;
	};
}
