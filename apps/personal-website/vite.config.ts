import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit({ adapter: adapter(), preprocess: vitePreprocess() })],
	preview: {
		port: 5555,
	},
};

export default config;
