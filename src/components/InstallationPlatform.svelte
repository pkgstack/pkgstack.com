<script lang="ts">
	import { detect } from "detect-browser";
	import { Highlight } from "svelte-highlight";
	import { bash } from "svelte-highlight/languages";

	const browser = detect();
</script>

{#if browser?.os?.startsWith("Windows")}
	<p>It looks like you're rocking Windows. Unfortunately <strong>we don't provide binaries for Windows yet</strong>, stay tuned though since that is high on our priorities list.</p>
	<p>If we've got your OS wrong, here are installation instructions for Linux.</p>
{:else}
	<p>
		It looks like you're rocking macOS, Linux, or another
		Unix-like OS. To download METAx and install META run the
		following in your terminal, then follow the on-screen
		instructions
	</p>
{/if}


<div class="mockup-code">
	<Highlight
		language={bash}
		code={`curl -fsSL https://pkgstack.com/sh | bash`}
	/>
</div>
