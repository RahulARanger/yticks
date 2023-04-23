import { errorResponse } from "./response";

export interface Comment {
	kind: "youtube#comment";
	etag: string;
	id: string;
	snippet: {
		authorDisplayName: string;
		authorProfileImageUrl: string;
		authorChannelUrl: string;
		authorChannelId: {
			value: string;
		};
		channelId?: string;
		videoId: string;
		textDisplay: string;
		textOriginal: string;
		parentId?: string;
		canRate: boolean;
		viewerRating: string;
		likeCount: number;
		moderationStatus?: string;
		publishedAt: string;
		updatedAt: string;
	};
}

export interface CommentThread {
	kind: "youtube#commentThread";
	etag: string;
	id: string;
	snippet: {
		channelId?: string;
		videoId: string;
		topLevelComment: Comment;
		canReply: boolean;
		totalReplyCount: number;
		isPublic: boolean;
	};
	replies?: {
		comments: Array<Comment>;
	};
}

export interface ListCommentThreadResponse extends errorResponse {
	kind: "youtube#commentThreadListResponse";
	etag: string;
	nextPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: Array<CommentThread>;
}
