import { urlWithArgs } from "./generalRequest";
import useSWRImmutable from "swr/immutable";
import useSWRInfinite from "swr/infinite";
import { askButRead } from "./generalRequest";
import type { ExpectedVideoDetails } from "../types/Video";
import { ExpectedPlaylist } from "@/pages/api/data/playList";
import { ExpectedPlaylistItems } from "@/pages/api/data/playlistItems";
import { ExpectedCommentThread } from "../types/Comments";

const isMock = process.env.NEXT_PUBLIC_IS_DEV ? "mock" : "data";

interface SWRResponse<Details> {
    data?: Details;
    error?: string;
    isLoading: boolean;
}

export function AskVideo(
    videoID: string | null,
    width?: string,
    height?: string
): SWRResponse<ExpectedVideoDetails> {
    return useSWRImmutable(
        videoID
            ? urlWithArgs(`/api/${isMock}/videoById`, {
                  maxWidth: width ?? "730",
                  maxHeight: height ?? "400",
                  videoID: videoID,
              })
            : "",
        (url: string) => askButRead<ExpectedVideoDetails>(url)
    );
}

function loadComments(
    videoID: string,
    _: number,
    prevCommentThread?: ExpectedCommentThread
) {
    const details = prevCommentThread?.details;
    const token = details && details?.nextPageToken;
    return urlWithArgs(`/api/${isMock}/commentThreads`, {
        videoID: videoID,
        pageToken: token || "",
    });
}

interface SWRInfResponse<Details> {
    data: Array<Details> | undefined;
    error?: string;
    isLoading: boolean;
    size: number;
    setSize: (page: number) => void;
}

export function AskCommentThreads(
    videoID: string
): SWRInfResponse<ExpectedCommentThread> {
    return useSWRInfinite(
        (...args) => loadComments(videoID, ...args),
        (url: string) => askButRead<ExpectedCommentThread>(url),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateFirstPage: false,
            revalidateAll: false,
        }
    );
}

export function AskPlayList(
    listID: string | null
): SWRResponse<ExpectedPlaylist> {
    return useSWRImmutable(
        listID
            ? urlWithArgs(`/api/${isMock}/playList`, {
                  listID,
              })
            : null,
        (url: string) => askButRead<ExpectedPlaylist>(url)
    );
}

export function AskPlayListItems(
    listID: string | null
): SWRResponse<ExpectedPlaylistItems> {
    return useSWRImmutable(
        listID
            ? urlWithArgs(`/api/${isMock}/playlistItems`, {
                  listID,
              })
            : null,
        (url: string) => askButRead<ExpectedPlaylistItems>(url)
    );
}
