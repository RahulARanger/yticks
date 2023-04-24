import { urlWithArgs } from "./generalRequest";
import useSWRImmutable from "swr/immutable";
import { askButRead } from "./generalRequest";
import { ExpectedDetails } from "../types/response";
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

export function AskCommentThreads(videoID: string): SWRResponse<ExpectedCommentThread> {
	return useSWRImmutable(
		urlWithArgs(`/api/${isMock}/commentThreads`, {
			videoID: videoID,
		}),
		(url: string) => askButRead<ExpectedCommentThread>(url)
	);
}
