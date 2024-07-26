<script lang="ts">
	import { lightMode } from "./shared";
	
	export let lightModeEnabled: boolean;

	lightMode.set(lightModeEnabled);
</script>