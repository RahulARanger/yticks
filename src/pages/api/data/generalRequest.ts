import type { NextApiResponse } from "next";

export default async function ask(
	url: string,
	args: { [key: string]: string }
): Promise<Response> {
	if (!process.env.API_KEY) throw new Error("Missing API Key");

	const patchedURL = new URLSearchParams();
	patchedURL.set("key", process.env.API_KEY);

	for (let key of Object.keys(args)) {
		patchedURL.set(key, args[key]);
	}
	return fetch(url + "?" + decodeURIComponent(patchedURL.toString()));
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
