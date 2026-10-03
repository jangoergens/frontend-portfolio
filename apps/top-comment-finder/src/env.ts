import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
	GOOGLE_API_KEY: { schema: (value) => value },
	GOOGLE_API_MODE: {
		schema: (value) => {
			if (value !== undefined && value !== "development" && value !== "production") {
				throw new Error("GOOGLE_API_MODE must be development or production.");
			}
			return value;
		},
	},
});
