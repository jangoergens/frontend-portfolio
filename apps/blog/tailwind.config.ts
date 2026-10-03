import type { Config } from "tailwindcss";

import { skeleton } from "@skeletonlabs/tw-plugin";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);

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
