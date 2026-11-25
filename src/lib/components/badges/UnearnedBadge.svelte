<script lang="ts">
	export let imageSrc: string;
	export let alt: string = 'Badge';
	export let width: number = 150;
	export let height: number = 150;
	export let tooltip: boolean;
</script>

<div class="group relative inline-block">
	<img
		src={imageSrc}
		{alt}
		{width}
		{height}
		class="h-auto w-24 opacity-60 brightness-75 grayscale sm:w-[150px]"
	/>
	{#if tooltip}
		<div
			class="text-dtext absolute left-1/2 z-10 mt-2 w-max -translate-x-1/2 px-3 py-2 text-sm opacity-0 transition-opacity group-hover:opacity-80"
		>
			In progress!
		</div>
	{/if}
</div>
