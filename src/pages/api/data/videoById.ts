import { ExpectedDetails } from "@/components/types/response";
import { VideoListDetails } from "@/components/types/Video";
import type { NextApiRequest, NextApiResponse } from "next";
import ask, {
    letThemKnow,
    sendError,
} from "../../../components/helper/generalRequest";

export interface contentDetails {
    duration: string;
}

export type ExpectedVideoDetails = ExpectedDetails<VideoListDetails | false>;

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ExpectedVideoDetails>
) {
    const { videoID, maxWidth, maxHeight } = request.query;

    if (!videoID) {
        return letThemKnow(response, "Please provide the ID for the video.");
    }
    try {
        const resp = await ask("https://www.googleapis.com/youtube/v3/videos", {
            id: String(videoID),
            part: "contentDetails,liveStreamingDetails,localizations,player,recordingDetails,snippet,statistics,status,topicDetails",
            maxWidth: String(maxWidth),
            maxHeight: String(maxHeight),
        });

        const videoDetails: VideoListDetails = await resp.json();

        if (!videoDetails?.pageInfo?.totalResults)
            return letThemKnow(response, "No Results found");

        response.status(200).json({ failed: false, details: videoDetails });
    } catch (error) {
        letThemKnow(
            response,
            sendError(
                error,
                `Failed to retrieve the details for the video ${videoID}`
            )
        );
    }
}
