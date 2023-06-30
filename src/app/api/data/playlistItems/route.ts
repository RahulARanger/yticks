import ask, {
    letThemKnow,
    sendError,
} from "@/components/helper/generalRequest";
import { PlayListItemResponse } from "@/components/types/playlist";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(request: NextRequest) {
    const { listID } = await request.json();

    if (!listID) return letThemKnow("Please provide the ID for the playlist.");
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
