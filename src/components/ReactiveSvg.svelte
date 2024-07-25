<script lang="ts">
	import { lightMode } from "./shared";

	export let src: string;
	export let width: string | number = "100%";
	export let height: string | number = "100%";
	
</script>

<div style="mask: url({src}) no-repeat center; display: block; mask-size: {width} {height};"
	class:bg-white={!$lightMode}
	class:bg-black={$lightMode}
	{...$$restProps}></div>