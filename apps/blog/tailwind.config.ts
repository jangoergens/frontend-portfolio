import type { Config } from "tailwindcss";

import { skeleton } from "@skeletonlabs/tw-plugin";
import { join } from "path";

const config = {
	content: [
		"./src/**/*.{astro,html,svelte,ts}",
		join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{astro,html,svelte,ts}"),
	],
	darkMode: "class",
	plugins: [
		skeleton({
			themes: { preset: ["skeleton"] },
		}),
	],
} satisfies Config;

export default config;
