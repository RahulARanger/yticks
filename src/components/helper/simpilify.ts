import { NextApiResponse } from "next";
import { letThemKnow } from "./generalRequest";
import { ExpectedDetails } from "../types/response";
import dayjs from "dayjs";

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
    return dayjs(datetime).format("MMMM D, YYYY h:mm A")
}