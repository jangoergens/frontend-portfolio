import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [
		tailwindcss(),
		sveltekit({ adapter: adapter({ runtime: "nodejs24.x" }), preprocess: vitePreprocess() }),
	],
	preview: {
		port: 4444,
	},
};

export default config;
