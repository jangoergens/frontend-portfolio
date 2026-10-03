import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
	testDir: "./tests",
	use: { baseURL: "http://127.0.0.1:4444" },
	webServer: {
		command: "pnpm preview --host 127.0.0.1",
		url: "http://127.0.0.1:4444",
		env: { GOOGLE_API_MODE: "development" },
		timeout: 60000,
	},
};

export default config;
