<script lang="ts">
	import { MagnifyingGlass } from "radix-svelte-icons";

	function keydown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			if (value == "") return;
			window.location.href = `/search/${value}`;
		}
	}

	function submit() {
		if (value == "") return;
		window.location.href = `/search/${value}`;
	}

	export let value: string = "";
</script>

<div class="flex flex-row gap-0 items-center">
	<label class="input input-lg bg-base-200 rounded-none flex items-center gap-2">
		<MagnifyingGlass size={24} class="text-gray-500"></MagnifyingGlass>
		<input type="text" class="grow" bind:value placeholder="Search Packages..." on:keydown={keydown} />
	</label>
	<button class="btn btn-lg btn-secondary rounded-none" on:click={submit}>Search</button>
</div>