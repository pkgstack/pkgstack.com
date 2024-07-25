<script lang="ts">
	import { Moon, Sun } from "radix-svelte-icons";
	import Cookie from "js-cookie"
	import { lightMode } from "./shared";

	function toggleLightTheme() {
		lightMode.set(!$lightMode)
		Cookie.set("light", $lightMode.toString(), {
			expires: 365,
			path: "/",
		})
	}
</script>


<button class="btn btn-square btn-ghost" on:click={toggleLightTheme}>
	<div class="swap swap-rotate">
		<input type="checkbox" class="theme-controller" hidden checked={$lightMode} value={"retro"} />
		<input type="checkbox" class="theme-controller" hidden checked={!$lightMode} value={"forest"} />
	
		<Sun size={24} class={$lightMode ? "swap-on" : "swap-off"} />
		<Moon size={24} class={$lightMode ? "swap-off" : "swap-on"} />
	</div>
	
</button>