import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	webServer: {
		command: "pnpm build && pnpm preview",
		port: 5555,
		timeout: 10000,
	},
};

export default config;
