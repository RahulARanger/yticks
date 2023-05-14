import { ExpectedDetails } from "@/components/types/response";
import type { NextApiRequest, NextApiResponse } from "next";
import ask, {
    letThemKnow,
    sendError,
} from "../../../components/helper/generalRequest";
import { PlayListItemResponse } from "@/components/types/playlist";

export type ExpectedPlaylistItems = ExpectedDetails<PlayListItemResponse>;

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ExpectedPlaylistItems | undefined>
) {
    const { listID } = request.query;

    if (!listID) {
        return letThemKnow(response, "Please provide the ID for the playlist.");
    }
    try {
        const resp = await ask(
            "https://www.googleapis.com/youtube/v3/playlistItems",
            {
                playlistId: String(listID),
                part: "id,snippet,status,contentDetails",
            }
        );

        const playList: PlayListItemResponse = await resp.json();

        if (!playList?.items) {
            if (playList?.error?.message)
                return letThemKnow(response, playList.error.message);
            return letThemKnow(response, "No Results found");
        }

        response.status(200).json({ failed: false, details: playList });
    } catch (error) {
        letThemKnow(
            response,
            sendError(
                error,
                `Failed to retrieve the comments added for the playlist ${listID}`
            )
        );
    }
}
