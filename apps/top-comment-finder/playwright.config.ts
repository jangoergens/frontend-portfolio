import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "pnpm build && pnpm preview",
		port: 4444,
	},
};

export default config;
