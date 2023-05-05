import {
    ExpectedDetails,
    unpredictableResponse,
} from "@/components/types/response";
import type { NextApiRequest } from "next";
import {
    askHuggingFace,
    letThemKnow,
    sendError,
} from "../../../components/helper/generalRequest";
import { AskForLanguage } from "@/components/types/askForNLP";
import { isModalLoading, extract_needed } from "@/components/helper/simpilify";

export const languageMap = {
    ar: "arabic",
    bg: "bulgarian",
    de: "german",
    el: "modern greek",
    en: "english",
    es: "spanish",
    fr: "french",
    hi: "hindi",
    it: "italian",
    ja: "japanese",
    nl: "dutch",
    pl: "polish",
    pt: "portuguese",
    ru: "russian",
    sw: "swahili",
    th: "thai",
    tr: "turkish",
    ur: "urdu",
    vi: "vietnamese",
    zh: "chinese",
};

export type ExpectedLanguageResults = ExpectedDetails<AskForLanguage>;

export default async function handler(
    request: NextApiRequest,
    response: unpredictableResponse
) {
    const { commentText, commentID } = request.query;
    // commentID is planned to be used in the future {in DB}

    if (!commentText) {
        return letThemKnow(response, "Please provide the comment");
    }
    try {
        const lang_detect_modal =
            "https://api-inference.huggingface.co/models/papluca/xlm-roberta-base-language-detection";

        const resp = await askHuggingFace<[AskForLanguage]>(lang_detect_modal, {
            inputs: extract_needed(String(commentText)),
        });

        // sample result:
        // [
        //     [
        //         {'label': 'ja', 'score': 0.9934961795806885}, {'label': 'hi', 'score': 0.0006498367292806506}, {'label': 'th', 'score': 0.0005395150510594249}, {'label': 'ur', 'score': 0.0005237347213551402}, {'label': 'tr', 'score': 0.0005181265878491104}, {'label': 'pt', 'score': 0.0005020945682190359}, {'label': 'ar', 'score': 0.00044312141835689545}, {'label': 'en', 'score': 0.0003885451296810061}, {'label': 'fr', 'score': 0.0003737546212505549}, {'label': 'zh', 'score': 0.00034887183574028313}, {'label': 'ru', 'score': 0.0003194974269717932}, {'label': 'el', 'score': 0.00030339747900143266}, {'label': 'sw', 'score': 0.00029123632702976465}, {'label': 'vi', 'score': 0.00028067739913240075}, {'label': 'it', 'score': 0.00025827219360508025}, {'label': 'nl', 'score': 0.0001999909000005573}, {'label': 'bg', 'score': 0.00019447664089966565}, {'label': 'es', 'score': 0.00014620390720665455}, {'label': 'de', 'score': 0.00011434218322392553}, {'label': 'pl', 'score': 0.00010812070831889287}
        //     ]
        // ]

        isModalLoading(response, resp);

        const results: AskForLanguage = await resp[0];
        response.status(200).json({ failed: false, details: results });
    } catch (error) {
        letThemKnow(
            response,
            sendError(
                error,
                `Failed to retrieve the Language of the comment ID: ${commentID}`
            )
        );
    }
}
