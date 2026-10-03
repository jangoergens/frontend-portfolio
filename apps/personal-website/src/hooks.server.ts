import type { Handle } from "@sveltejs/kit/hooks";

import { getLocale } from "#lib/i18n.ts";

export const handle: Handle = ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="en">', `<html lang="${getLocale(event.params.lang)}">`),
	});
