<script lang="ts">
	import { lightMode } from "./shared";

	export let srclight: string;
	export let srcdark: string;

	export let alt = ""
</script>

{#if $lightMode}
	<img src={srclight} {alt} {...$$restProps} />
{:else}
	<img src={srcdark} {alt} {...$$restProps} />
{/if}