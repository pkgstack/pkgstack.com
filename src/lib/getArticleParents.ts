import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";

export async function getArticleParents<T extends CollectionKey>(article: CollectionEntry<T>, collectionName: T): Promise<CollectionEntry<T>[]> {
	let slugComponents = article.slug.split("/")
	const collection = await getCollection(collectionName);
	const parents: CollectionEntry<T>[] = []
	for (let i = 0; i < slugComponents.length; i++) {
		const adjustedSlug = slugComponents.slice(0, -i).join("/");
		for (const entry of collection) {
			if (entry.slug == adjustedSlug) {
				parents.push(entry)
			}
		}
	}

	return parents.reverse()
}