<script lang="ts">
	import type { MarkdownHeading } from "astro";
	import { onMount } from "svelte";

	export let headings: (MarkdownHeading & {highlighted?: boolean})[];
	let headingElements: HTMLElement[] = [];

	onMount(() => {
		headingElements = headings.map(heading => {
			return document.getElementById(heading.slug);
		}) as HTMLElement[]
	})

	function findElementToHighlight() {
		const boundingBoxes = headingElements.map(headingElement => {
			if (!headingElement) return { top: Infinity, bottom: Infinity };
			return headingElement.getBoundingClientRect();
		})

		// Find the bounding box closest to zero
		const closestToZero = boundingBoxes.reduce(function(prev, curr) {
			return (Math.abs(curr.top) < Math.abs(prev.top) ? curr : prev);
		});

		const index = boundingBoxes.indexOf(closestToZero);
		highlightedIndex = index;
	}

	let highlightedIndex = 0;
</script>

<svelte:window on:scroll={findElementToHighlight}></svelte:window>

<div class="border-l-4 border-l-primary h-min pl-4 sticky top-[160px]">
	{#each headings as heading, i}
		<a href={`#${heading.slug}`} class="block transition-colors duration-200 py-1 text-base no-underline hover:underline"
		class:font-bold={highlightedIndex == i}
		style={`margin-left: ${(heading.depth - 1) * 16}px`}>
			{heading.text}
		</a>
	{/each}
</div>