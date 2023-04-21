import type { NextApiResponse } from "next";

type askArgs = { [key: string]: string };
export default async function ask(
	url: string,
	args: askArgs
): Promise<Response> {
	if (!process.env.API_KEY) throw new Error("Missing API Key");

	const patchedURL = new URLSearchParams();
	patchedURL.set("key", process.env.API_KEY);

	for (let key of Object.keys(args)) {
		patchedURL.set(key, args[key]);
	}
	return fetch(url + "?" + decodeURIComponent(patchedURL.toString()));
}

export async function requestFromUser(
	url: string,
	args: askArgs
): Promise<Response> {
	const patchedURL = new URLSearchParams();

	for (let key of Object.keys(args)) {
		patchedURL.set(key, args[key]);
	}
	return fetch(url + "?" + decodeURIComponent(patchedURL.toString()));
}

export async function askButRead<ExpectedResponse>(
	url: string,
	args: askArgs
): Promise<ExpectedResponse> {
	return requestFromUser(url, args).then(async function (response) {
		let resp;
		if (!response.ok) {
			try {
				resp = await response.json();
			} catch (error) {
				throw new Error(
					`Failed to request url: ${url} because, ${response.statusText}`
				);
			}

			if (resp?.failed) throw new Error(resp?.details);
			throw new Error(
				`Unknown Error, please note the steps and let me know || ${response.statusText} - ${url}	`
			);
		}
		return response.json();
	});
}

export function letThemKnow(
	response: NextApiResponse<{ failed: boolean; details: string }>,
	error: string
) {
	response.status(500).json({
		failed: true,
		details: error,
	});
}

export function sendError(actualError: unknown, fallbackError: string): string {
	const safeError = String(actualError).replace(
		process.env.API_KEY ?? "_KEY_",
		"_KEY_"
	);
	return safeError ?? fallbackError;
}
