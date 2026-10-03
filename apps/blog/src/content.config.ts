import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const postsCollection = defineCollection({
	loader: glob({ base: "./src/content/posts", pattern: "**/*.md" }),
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
});

export const collections = {
	posts: postsCollection,
};
