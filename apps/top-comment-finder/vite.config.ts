import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit({ adapter: adapter(), preprocess: vitePreprocess() }), imagetools()],
	preview: {
		port: 4444,
	},
};

export default config;
