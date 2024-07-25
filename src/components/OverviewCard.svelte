<script lang="ts">
	const tailwindColors = ["#cbd5e1", "#d1d5db", "#d4d4d8", "#d4d4d4", "#d6d3d1", "#fca5a5", "#fdba74", "#fcd34d", "#fde047", "#bef264", "#86efac", "#6ee7b7", "#5eead4", "#67e8f9", "#7dd3fc", "#93c5fd", "#a5b4fc", "#c4b5fd", "#d8b4fe", "#f0abfc", "#f9a8d4", "#fda4af"];

	const randomColor = tailwindColors[Math.floor(Math.random() * tailwindColors.length)];

	export let title: string;
	export let description: string;
	export let href: string;
</script>

<a {href} class="card w-full bg-base-300 shadow-xl no-underline cursor-pointer bg-gradient-to-tr from-red-300 to-slate-300 dark:to-slate-600 transition-all bg-pos-0 bg-size-200 duration-500 hover:bg-pos-100" style="--tw-gradient-from: {randomColor} var(--tw-gradient-from-position);">
	<div class="card-body">
		<h2 class="card-title !mt-4 !mb-2">{title}</h2>
		<p>{description}</p>
	</div>
</a>