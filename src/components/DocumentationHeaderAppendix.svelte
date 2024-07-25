<script lang="ts">
	import type { RecursiveArticleTree } from "./types"
	import type { CollectionEntry } from "astro:content"
	import { HamburgerMenu } from "radix-svelte-icons";
	import CollectionTree from "./CollectionTree.svelte";

	export let listOfTitles: CollectionEntry<"docs">[];

	export let tree: RecursiveArticleTree;
	export let slug: string;
	export let base: string = "docs";
</script>

<nav class="navbar bg-base-100 border-b-2 border-b-base-200 h-6 sticky top-[80px] z-10">
	<div class="flex flex-row justify-between w-full mx-auto px-8">
		<div class="text-sm breadcrumbs">
			<ul>
				{#each listOfTitles as article}
					<li><a href="/{base}/{article.slug}" class="link link-hover">{article.data.title}</a></li>
				{/each}
			</ul>
		</div>
		<div class="drawer w-auto xl:hidden">
			<input id="my-drawer" type="checkbox" class="drawer-toggle" />
			<div class="drawer-content">
				<!-- Page content here -->
				<label for="my-drawer" class="btn btn-ghost drawer-button"><HamburgerMenu size={24}></HamburgerMenu></label>
			</div> 
			<div class="drawer-side">
				<label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
				<ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
					<CollectionTree tree={tree} {slug}></CollectionTree>
				</ul>
			</div>
		</div>
	</div>
</nav>