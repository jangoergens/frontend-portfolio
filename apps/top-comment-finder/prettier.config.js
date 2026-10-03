export default {
	overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	tailwindStylesheet: "./src/app.css",
	printWidth: 100,
	useTabs: true,
};
