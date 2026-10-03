import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./tests",
	use: { baseURL: "http://127.0.0.1:5555" },
	webServer: {
		command: "pnpm preview --host 127.0.0.1",
		url: "http://127.0.0.1:5555",
		timeout: 60000,
	},
};

export default config;
