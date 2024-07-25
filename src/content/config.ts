// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

export const docsCollectionSchema = z.object({
	title: z.string(),
	author: z.string(),
	description: z.string()
})

const docsCollection = defineCollection({
	type: "content",
	schema: docsCollectionSchema
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	docs: docsCollection,
};
