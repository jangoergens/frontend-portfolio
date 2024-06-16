import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "vite-imagetools";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit(), imagetools()],
	preview: {
		port: 4444,
	},
};

export default config;
