import { ExpectedDetails } from "@/components/types/response";
import type { NextApiRequest, NextApiResponse } from "next";
import ask, {
    letThemKnow,
    sendError,
} from "../../../components/helper/generalRequest";
import { PlayListResponse } from "@/components/types/playlist";

export type ExpectedPlaylist = ExpectedDetails<PlayListResponse>;

export function encodeID(videoID: string, listID: string) {
    return `${videoID} ${listID}`;
}

export function decodeID(encoded: string): [string, string] {
    console.log(encoded);
    const [videoID, listID] = encoded.split(" ");
    return [videoID, listID];
}

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<ExpectedPlaylist | undefined>
) {
    const { listID } = request.query;

    if (!listID) {
        return letThemKnow(response, "Please provide the ID for the playlist.");
    }
    try {
        const resp = await ask(
            "https://www.googleapis.com/youtube/v3/playlists",
            {
                id: String(listID),
                part: "id,snippet,status",
            }
        );

        const playList: PlayListResponse = await resp.json();

        if (!playList?.items?.length) {
            if (playList?.error?.message)
                return letThemKnow(response, playList.error.message);
            return letThemKnow(response, "No Results found");
        } else {
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
