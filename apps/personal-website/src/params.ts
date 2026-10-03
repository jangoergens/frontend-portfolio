import { defineParams } from "@sveltejs/kit/params";

import { isLocale } from "#lib/i18n.ts";

export const params = defineParams({
	lang: (value) => (isLocale(value) ? value : undefined),
});
