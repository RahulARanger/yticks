import type { NextApiRequest, NextApiResponse } from "next";
import ask, { letThemKnow, sendError } from "../../helper/generalRequest";

export interface RelatedVideo {
	id: {
		kind: string;
		videoId: string;
		channelId: string;
		playlistId: string;
	};
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: {
			[key: string]: {
				url: string;
				width: number;
				height: number;
			};
		};
		channelTitle: string;
		liveBroadcastContent: string;
		publishTime: string;
	};
	kind: "youtube#searchResult";
	etag: string;
}

export interface RelatedVideoDetails {
	kind: "youtube#searchListResponse";
	etag: string;
	items: Array<RelatedVideo>;
	nextPageToken: string;
	prevPageToken?: string;
	regionCode: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
}

export interface ExpectedRelatedVideoDetails {
	failed: boolean;
	details: RelatedVideoDetails | string;
}

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<ExpectedRelatedVideoDetails>
) {
	const { videoID } = request.query;

	if (!videoID) {
		return letThemKnow(response, "Please provide the ID for the video.");
	}
	try {
		const resp = await ask(`https://www.googleapis.com/youtube/v3/search`, {
			type: "video",
			relatedToVideoId: String(videoID),
			part: "snippet",
		});
		const related_things: RelatedVideoDetails = await resp.json();

		if (!related_things.items.length)
			return letThemKnow(response, "No Results found");

		response.status(200).json({ failed: false, details: related_things });
	} catch (error) {
		letThemKnow(
			response,
			sendError(
				error,
				`Failed to retrieve the related videos for ${videoID}`
			)
		);
	}
}
