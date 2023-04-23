import { urlWithArgs } from "./generalRequest";
import useSWRImmutable from "swr/immutable";
import { askButRead } from "./generalRequest";
import { ExpectedDetails } from "../types/response";

const isMock = process.env.IS_DEV ? "mock" : "data";

interface SWRResponse<Details> {
	data?: Details;
	error?: string;
	isLoading: boolean;
}

export function AskVideo<Type>(
	videoID: string,
	width?: string,
	height?: string
): SWRResponse<Type> {
	return useSWRImmutable(
		urlWithArgs(`/api/${isMock}/videoById`, {
			maxWidth: width ?? "730",
			maxHeight: height ?? "400",
			videoID: videoID,
		}),
		(url: string) => askButRead<Type>(url)
	);
}

export function AskCommentThreads<Type>(videoID: string): SWRResponse<Type> {
	return useSWRImmutable(
		urlWithArgs(`/api/${isMock}/commentThreads`, {
			videoID: videoID,
		}),
		(url: string) => askButRead<Type>(url)
	);
}
