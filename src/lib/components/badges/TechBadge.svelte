<script lang="ts">
	export let badgeName: string;
	export let imageSrc: string;
	export let alt: string = 'Badge';
	export let width: number = 60;
	export let height: number = 60;
</script>

<div class="group relative m-3 inline-block transition-all duration-200 ease-in-out md:m-5">
	<div
		class="relative inline-block transition-transform duration-200 ease-in-out group-hover:scale-110"
	>
		<img
			src={imageSrc}
			{alt}
			{width}
			{height}
			class="h-12 w-12 rounded-lg md:h-[60px] md:w-[60px]"
		/>
		<div
			class="bg-ctext text-cbackground pointer-events-none invisible absolute -bottom-7 left-1/2 z-50 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-all duration-200 ease-in-out group-hover:visible group-hover:opacity-100"
		>
			{badgeName}
		</div>
	</div>
</div>
