import { urlWithArgs } from "./generalRequest";
import useSWRImmutable from "swr/immutable";
import useSWRInfinite from "swr/infinite";
import { askButRead } from "./generalRequest";
import { ExpectedVideoDetails } from "@/pages/api/data/videoById";
import { ExpectedCommentThread } from "@/pages/api/data/commentThreads";
import { extract_needed } from "./simpilify";
import { ExpectedLanguageResults } from "@/pages/api/data/detectLanguage";

const isMock = process.env.NEXT_PUBLIC_IS_DEV ? "mock" : "data";

interface SWRResponse<Details> {
    data?: Details;
    error?: string;
    isLoading: boolean;
}

export function AskVideo(
    videoID: string,
    width?: string,
    height?: string
): SWRResponse<ExpectedVideoDetails> {
    return useSWRImmutable(
        urlWithArgs(`/api/${isMock}/videoById`, {
            maxWidth: width ?? "730",
            maxHeight: height ?? "400",
            videoID: videoID,
        }),
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

export function AskLangResults(
    comment_text: string,
    commentID: string,
    sendIt: boolean
): SWRResponse<ExpectedLanguageResults> {
    return useSWRImmutable(
        sendIt
            ? urlWithArgs(`/api/${isMock}/detectLanguage`, {
                  commentText: extract_needed(comment_text),
                  commentID,
              })
            : null,
        (url: string) => askButRead<ExpectedLanguageResults>(url)
    );
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
