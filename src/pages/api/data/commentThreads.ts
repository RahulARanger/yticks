import type { NextApiRequest, NextApiResponse } from "next";
import ask, {
	letThemKnow,
	sendError,
} from "../../../components/helper/generalRequest";

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

export interface ListCommentThreadResponse {
	kind: "youtube#commentThreadListResponse";
	etag: string;
	nextPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: Array<CommentThread>;
}
export interface ExpectedCommentThreadDetails {
	failed: boolean;
	details: ListCommentThreadResponse | string;
}

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<ExpectedCommentThreadDetails>
) {
	const { videoID } = request.query;

	if (!videoID) {
		return letThemKnow(response, "Please provide the ID for the video.");
	}
	try {
		const resp = await ask(
			"https://www.googleapis.com/youtube/v3/commentThreads",
			{
				videoId: String(videoID),
				part: "id,snippet,replies",
			}
		);

		const commentThread: ListCommentThreadResponse = await resp.json();

		if (!commentThread?.pageInfo?.totalResults)
			return letThemKnow(response, "No Results found");

		response.status(200).json({ failed: false, details: commentThread });
	} catch (error) {
		letThemKnow(
			response,
			sendError(
				error,
				`Failed to retrieve the comments added for the video ${videoID}`
			)
		);
	}
}
