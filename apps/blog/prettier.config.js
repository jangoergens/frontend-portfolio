export default {
	overrides: [
		{ files: '*.svelte', options: { parser: 'svelte' } },
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	printWidth: 100,
	singleQuote: true,
	useTabs: true,
};
