import ask, {
    letThemKnow,
    sendError,
} from "@/components/helper/generalRequest";
import { PlayListResponse } from "@/components/types/playlist";
import { NextRequest, NextResponse } from "next/server";

export function encodeID(videoID: string, listID: string) {
    return `${videoID} ${listID}`;
}

export function decodeID(encoded: string): [string, string] {
    console.log(encoded);
    const [videoID, listID] = encoded.split(" ");
    return [videoID, listID];
}

export default async function handler(request: NextRequest) {
    const { listID } = await request.json();
    if (!listID) letThemKnow("Please provide the ID for the playlist.");

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
            return letThemKnow(playList?.error?.message || "No Results found");
        }

        return NextResponse.json({ failed: false, details: playList });
    } catch (error) {
        return letThemKnow(
            sendError(
                error,
                `Failed to retrieve the comments added for the playlist ${listID}`
            )
        );
    }
}
