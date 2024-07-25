<script lang="ts">
	import type { RecursiveArticleTree } from "./types";

	export let tree: RecursiveArticleTree;
	export let slug: string;
	export let depth: number = 0;
	export let base: string = "docs";
</script>

{#if tree}
	<ul class="ml-2">
		{#each Object.entries(tree) as [key, node]}
			{#if node.entry}
				<li>
					<a
						href={`/${base}/${node.entry.slug}`}
						class:bg-primary={node.entry.slug == slug}
						class:font-bold={depth == 0}
						class="hover:bg-primary">{node.entry.data.title}</a
					>
				</li>
			{/if}
			{#if Object.keys(node.children).length > 0}
				<li>
					<svelte:self tree={node.children} depth={depth + 1} {slug} {base} />
				</li>
			{/if}
		{/each}
	</ul>
{/if}
