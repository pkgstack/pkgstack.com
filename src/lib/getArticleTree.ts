import type { CollectionEntry } from "astro:content";
import type { RecursiveArticleTree } from "#components/types";

export function getArticleTree(
	collection: (CollectionEntry<"docs"> | CollectionEntry<"stdlib">)[]
) {
	const tree: RecursiveArticleTree = {};

	// Sort collection into a tree structure depending on the slug.
	for (let i = 0; i < collection.length; i++) {
		const entry = collection[i];
		const slugParts = entry.slug.split("/");

		let currentLevel = tree;

		for (let j = 0; j < slugParts.length; j++) {
			const part = slugParts[j];

			// If the current level doesn't have the part, initialize it.
			if (!currentLevel[part]) {
				currentLevel[part] = { children: {} };
			}

			// If it's the last part, assign the entry.
			if (j === slugParts.length - 1) {
				currentLevel[part].entry = entry;
			}

			// Move to the next level.
			currentLevel = currentLevel[part].children;
		}
	}

	return tree;
}
