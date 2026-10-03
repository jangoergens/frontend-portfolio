import { GOOGLE_API_KEY, GOOGLE_API_MODE } from "$app/env/private";
import { type RequestEvent } from "@sveltejs/kit";

import { createCommentsHandler } from "#lib/server/comments.ts";

export async function GET({ fetch, getClientAddress, params, request }: RequestEvent) {
	let clientAddress = "unknown";
	if (GOOGLE_API_MODE === "production") {
		try {
			clientAddress = getClientAddress();
		} catch {
			/* Share one conservative limit when the adapter cannot identify the client. */
		}
	}
	const handle = createCommentsHandler({
		apiKey: GOOGLE_API_KEY,
		fetcher: fetch,
		mode: GOOGLE_API_MODE,
	});
	return handle(params.videoId, clientAddress, request.signal);
}
