import type { NextApiRequest, NextApiResponse } from "next";

export interface contentDetails {
	duration: string;
}

export interface snippet {
	categoryID: string;
}

interface thumbNail {
	[key: string]: {
		url: string;
		width: number;
		height: number;
	};
}

interface localizations {
	[key: string]: {
		title: string;
		description: string;
	};
}

export interface VideoDetails {
	kind: "youtube#video";
	etag: string;
	id: string;
	snippet: {
		publishedAt: string;
		channelId: string;
		title: string;
		description: string;
		thumbnails: thumbNail;
		channelTitle: string;
		tags: [string];
		categoryId: string;
		liveBroadcastContent: string;
		defaultLanguage: string;
		localized: {
			title: string;
			description: string;
		};
		defaultAudioLanguage: string;
	};
	contentDetails: {
		duration: string;
		dimension: string;
		definition: string;
		caption: string;
		licensedContent: boolean;
		regionRestriction: {
			allowed: [string];
			blocked: [string];
		};
		contentRating: {
			acbRating: string;
			agcomRating: string;
			anatelRating: string;
			bbfcRating: string;
			bfvcRating: string;
			bmukkRating: string;
			catvRating: string;
			catvfrRating: string;
			cbfcRating: string;
			cccRating: string;
			cceRating: string;
			chfilmRating: string;
			chvrsRating: string;
			cicfRating: string;
			cnaRating: string;
			cncRating: string;
			csaRating: string;
			cscfRating: string;
			czfilmRating: string;
			djctqRating: string;
			djctqRatingReasons: Array<string>;
			ecbmctRating: string;
			eefilmRating: string;
			egfilmRating: string;
			eirinRating: string;
			fcbmRating: string;
			fcoRating: string;
			fmocRating: string;
			fpbRating: string;
			fpbRatingReasons: Array<string>;
			fskRating: string;
			grfilmRating: string;
			icaaRating: string;
			ifcoRating: string;
			ilfilmRating: string;
			incaaRating: string;
			kfcbRating: string;
			kijkwijzerRating: string;
			kmrbRating: string;
			lsfRating: string;
			mccaaRating: string;
			mccypRating: string;
			mcstRating: string;
			mdaRating: string;
			medietilsynetRating: string;
			mekuRating: string;
			mibacRating: string;
			mocRating: string;
			moctwRating: string;
			mpaaRating: string;
			mpaatRating: string;
			mtrcbRating: string;
			nbcRating: string;
			nbcplRating: string;
			nfrcRating: string;
			nfvcbRating: string;
			nkclvRating: string;
			oflcRating: string;
			pefilmRating: string;
			rcnofRating: string;
			resorteviolenciaRating: string;
			rtcRating: string;
			rteRating: string;
			russiaRating: string;
			skfilmRating: string;
			smaisRating: string;
			smsaRating: string;
			tvpgRating: string;
			ytRating: string;
		};
		projection: string;
		hasCustomThumbnail: boolean;
	};
	status: {
		uploadStatus: string;
		failureReason: string;
		rejectionReason: string;
		privacyStatus: string;
		publishAt: string;
		license: string;
		embeddable: boolean;
		publicStatsViewable: boolean;
		madeForKids: boolean;
		selfDeclaredMadeForKids: boolean;
	};
	statistics: {
		viewCount: number;
		likeCount: number;
		dislikeCount: 0;
		favoriteCount: number;
		commentCount: number;
	};
	player: {
		embedHtml: string;
		embedHeight: number;
		embedWidth: number;
	};
	topicDetails: {
		topicIds: [string];
		relevantTopicIds: [string];
		topicCategories: [string];
	};
	recordingDetails: {
		recordingDate: string;
	};
	fileDetails: {
		fileName: string;
		fileSize: number;
		fileType: string;
		container: string;
		videoStreams: [
			{
				widthPixels: number;
				heightPixels: number;
				frameRateFps: number;
				aspectRatio: number;
				codec: string;
				bitrateBps: number;
				rotation: string;
				vendor: string;
			}
		];
		audioStreams: [
			{
				channelCount: number;
				codec: string;
				bitrateBps: number;
				vendor: string;
			}
		];
		durationMs: number;
		bitrateBps: number;
		creationTime: string;
	};
	processingDetails: {
		processingStatus: string;
		processingProgress: {
			partsTotal: number;
			partsProcessed: number;
			timeLeftMs: number;
		};
		processingFailureReason: string;
		fileDetailsAvailability: string;
		processingIssuesAvailability: string;
		tagSuggestionsAvailability: string;
		editorSuggestionsAvailability: string;
		thumbnailsAvailability: string;
	};
	suggestions: {
		processingErrors: [string];
		processingWarnings: [string];
		processingHints: [string];
		tagSuggestions: [
			{
				tag: string;
				categoryRestricts: [string];
			}
		];
		editorSuggestions: [string];
	};
	liveStreamingDetails: {
		actualStartTime: string;
		actualEndTime: string;
		scheduledStartTime: string;
		scheduledEndTime: string;
		concurrentViewers: number;
		activeLiveChatId: string;
	};
	localizations: localizations;
}

async function ask(videoID: string): Promise<Response> {
	if (!process.env.API_KEY) throw new Error("Missing API Key");
	return fetch(
		`https://www.googleapis.com/youtube/v3/videos?key=${process.env.API_KEY}&id=${videoID}&part=contentDetails,liveStreamingDetails,localizations,player,recordingDetails,snippet,statistics,status,topicDetails`
	);
}

export interface VideoListDetails {
	kind: "youtube#videoListResponse";
	etag: string;
	nextPageToken: string;
	prevPageToken: string;
	pageInfo: {
		totalResults: number;
		resultsPerPage: number;
	};
	items: Array<VideoDetails>;
}

export interface ExpectedVideoDetails {
	failed: boolean;
	details: VideoListDetails | string;
}

function letThemKnow(
	response: NextApiResponse<ExpectedVideoDetails>,
	error: string
) {
	response.status(500).json({
		failed: true,
		details: error,
	});
}

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<ExpectedVideoDetails>
) {
	const { videoID } = request.query;

	if (!videoID) {
		return letThemKnow(response, "Please provide the ID for the video.");
	}
	try {
		const resp = await ask(String(videoID));
		const videoDetails: VideoListDetails = await resp.json();

		if (!videoDetails?.pageInfo?.totalResults)
			return letThemKnow(response, "No Results found");

		response.status(200).json({ failed: false, details: videoDetails });
	} catch (error) {
		const e =
			String(error) ??
			`Failed to retrieve the details for the video ${videoID}`;
		letThemKnow(response, e);
	}
}
