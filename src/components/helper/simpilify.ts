import { NextApiResponse } from "next";
import { letThemKnow } from "./generalRequest";
import { ExpectedDetails } from "../types/response";

export function extract_needed(originalText: string): string {
    const text = originalText.replace(/[^a-zA-Z\s]/g, ""); // we do not need symbols, punctuations for detecting the language
    return text.slice(0, 100); // first 100 words only...
}

export function isModalLoading(
    _response: NextApiResponse<ExpectedDetails<false>>,
    response: { error: string; estimated_time: number } | any
) {
    if (response?.error && typeof response?.estimated_time === "number")
        return letThemKnow(_response, "Modal is laoding, please request again");
    return false;
}
