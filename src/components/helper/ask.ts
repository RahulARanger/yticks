import { urlWithArgs } from "./generalRequest";
import useSWRImmutable from "swr/immutable";
import useSWRInfinite from "swr/infinite"
import { askButRead } from "./generalRequest";
import { ExpectedVideoDetails } from "@/pages/api/data/videoById";
import { ExpectedCommentThread } from "@/pages/api/data/commentThreads";

const isMock = process.env.IS_DEV ? "mock" : "data";

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


function loadComments(videoID: string, pageIndex: number, prevCommentThread?: ExpectedCommentThread) {
	console.log(pageIndex)
	console.log(prevCommentThread)
	return urlWithArgs(`/api/${isMock}/commentThreads`, {
		videoID: videoID,
	})
}

interface SWRInfResponse<Details> {
	data: Array<Details> | undefined
	error?: string;
	isLoading: boolean;
	size: number;
	setSize: (page: number) => void;

}

export function AskCommentThreads(videoID: string): SWRInfResponse<ExpectedCommentThread> {
	return useSWRInfinite(
		(...args) => loadComments(videoID, ...args),
		(url: string) => askButRead<ExpectedCommentThread>(url)
	);
}
