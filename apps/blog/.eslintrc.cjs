module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:perfectionist/recommended-natural",
		"plugin:astro/recommended",
		"plugin:svelte/recommended",
		"prettier",
	],
	overrides: [
		{
			files: ["*.astro"],
			parser: "astro-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		extraFileExtensions: [".astro", ".svelte"],
		project: true,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "perfectionist"],
	root: true,
};
