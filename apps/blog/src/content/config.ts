import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
	schema: z.object({
		author: z.string(),
		description: z.string(),
		image: z.object({
			alt: z.string(),
			url: z.string(),
		}),
		pubDate: z.date(),
		tags: z.array(z.string()),
		title: z.string(),
	}),
	type: 'content',
});

export const collections = {
	posts: postsCollection,
};
