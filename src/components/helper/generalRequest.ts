import { unpredictableResponse } from "../types/response";

type askArgs = { [key: string]: string };

export function urlWithArgs(url: string, args: askArgs): string {
    const patchedURL = new URLSearchParams();

    for (let key of Object.keys(args)) {
        patchedURL.set(key, args[key]);
    }
    return url + "?" + decodeURIComponent(patchedURL.toString());
}

export default async function ask(
    url: string,
    args: askArgs
): Promise<Response> {
    if (!process.env.API_KEY) throw new Error("Missing API Key");
    return fetch(urlWithArgs(url, { key: process.env.API_KEY, ...args }));
}

export async function requestFromUser(
    url: string,
    args: askArgs
): Promise<Response> {
    return fetch(urlWithArgs(url, args));
}

async function ensure(url: string, response: Response) {
    if (response.ok) return;

    let resp;
    try {
        resp = await response.json();
    } catch (error) {
        throw new Error(
            `Failed to request url: ${url} because, ${response.statusText}`
        );
    }
    if (resp?.failed) throw new Error(resp?.failed);
    throw new Error(
        `Unknown Error, please note the steps and let me know || ${response.statusText} - ${url}	`
    );
}

export async function askButRead<ExpectedResponse>(
    url: string
): Promise<ExpectedResponse> {
    return fetch(url).then(async function (response) {
        await ensure(url, response);
        return response.json();
    });
}

export function letThemKnow(response: unpredictableResponse, error: string) {
    response.status(500).json({
        failed: error,
        details: undefined,
    });
}

export function sendError(actualError: unknown, fallbackError: string): string {
    const safeError = String(actualError).replace(
        process.env.API_KEY ?? "_KEY_",
        "_KEY_"
    );
    return safeError ?? fallbackError;
}

export async function askHuggingFace<ExpectedResponse>(
    url: string,
    body: Object
): Promise<ExpectedResponse> {
    return await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE}`,
        },
        method: "POST",
        body: JSON.stringify(body),
    }).then(async function (response) {
        await ensure(url, response);
        return response.json();
    });
}
