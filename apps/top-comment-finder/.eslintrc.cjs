module.exports = {
	env: {
		browser: true,
		es2022: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:perfectionist/recommended-natural',
		'plugin:svelte/recommended',
		'prettier',
	],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		extraFileExtensions: ['.svelte'],
		project: true,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'perfectionist'],
	root: true,
};
