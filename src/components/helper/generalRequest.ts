import type { NextApiResponse } from "next";
import { env } from "process";

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

export async function askButRead<ExpectedResponse>(
	url: string
): Promise<ExpectedResponse> {
	return fetch(url).then(async function (response) {
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
