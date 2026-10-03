import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
	FORMSPREE_ENDPOINT: {
		public: true,
		schema: (value) => {
			const endpoint = value?.trim() ?? "";
			if (endpoint && !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
				throw new Error("FORMSPREE_ENDPOINT must be a https://formspree.io/f/ form URL.");
			}
			return endpoint;
		},
		static: true,
	},
});
