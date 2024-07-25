<script lang="ts">
	import PackageSearchBar from "./PackageSearchBar.svelte";

export let query: string;
</script>

<nav class="navbar bg-base-100 border-b-2 border-b-base-200 sticky top-[80px] z-10">
	<div class="flex flex-row justify-between w-full mx-auto px-8 max-w-[1400px]">
		<PackageSearchBar value={query}></PackageSearchBar>
	</div>
</nav>