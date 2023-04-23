import { ListCommentThreadResponse } from "@/components/types/Comments";
import { ExpectedDetails } from "@/components/types/response";
import type { NextApiRequest, NextApiResponse } from "next";
import ask, {
	letThemKnow,
	sendError,
} from "../../../components/helper/generalRequest";


export type ExpectedCommentThread = ExpectedDetails<ListCommentThreadResponse | false>

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse<ExpectedCommentThread>
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
