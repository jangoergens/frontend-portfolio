import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
	integrations: [svelte()],
	// Skeleton v2 generates selectors rejected by Vite 8's Lightning CSS minifier.
	// Keep the existing theme until its Tailwind/Skeleton migration is complete.
	vite: { build: { cssMinify: "esbuild" } },
});
