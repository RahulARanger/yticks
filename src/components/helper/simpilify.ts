import { NextApiResponse } from "next";
import { letThemKnow } from "./generalRequest";
import { ExpectedDetails } from "../types/response";
import dayjs from "dayjs";
import { thumbNail } from "../types/Video";

export function extract_needed(originalText: string): string {
    const text = originalText.replace(/[^a-zA-Z\s]/g, ""); // we do not need symbols, punctuations for detecting the language
    return text.slice(0, 100); // first 100 words only...
}

export function isModalLoading(
    _response: NextApiResponse<ExpectedDetails<any> | undefined>,
    response: { error: string; estimated_time: number } | any
) {
    if (response?.error && typeof response?.estimated_time === "number")
        return letThemKnow(_response, "Modal is loading, please request again");
    return false;
}

export function formatDateTime(datetime: string) {
    return dayjs(datetime).format("MMMM D, YYYY h:mm A");
}

export function truncateText(text: string, limit: number) {
    const length = text.length;
    return length <= limit ? text : text.slice(0, limit + 1) + "...";
}

export function extractThumbnail(thumbnail: thumbNail) {
    if (thumbnail.maxres) return thumbnail.maxres;
    if (thumbnail.high) return thumbnail.high;
    if (thumbnail.standard) return thumbnail.standard;
    if (thumbnail.medium) return thumbnail.medium;
    return thumbnail.default;
}
