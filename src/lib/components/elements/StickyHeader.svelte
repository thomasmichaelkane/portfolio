<script lang="ts">
	import { smoothScrollTo } from '$lib/utils/scroll';
	import HouseIcon from './HouseIcon.svelte';

	export let sectionName: string;
	export let headerColor: string;
	export let sectionLink: string | undefined = undefined;
	export let linkText: string | undefined = undefined;
	export let arrowDirection: string | undefined = undefined;
	/** Show a house icon linking to / instead of the section name */
	export let home = false;
	/** Click handler for the home icon (e.g. to play a transition first) */
	export let onHome: ((e: MouseEvent) => void) | undefined = undefined;
	/** Hold the bar above the top of the screen; set false to slide it down */
	export let raised = false;
	export let slideMs = 500;
</script>

<div
	class="short:h-12 sticky top-0 z-50 h-12 md:h-18 bg-{headerColor} transition-transform ease-out"
	class:-translate-y-full={raised}
	style:transition-duration="{slideMs}ms"
>
	<div class="mx-auto flex h-full items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
		{#if home}
			<a
				href="/"
				aria-label="Home"
				onclick={onHome}
				class="text-ltext transition-transform duration-200 ease-out hover:scale-115 focus-visible:scale-115"
			>
				<HouseIcon class="short:h-7 short:w-7 h-7 w-7 md:h-11 md:w-11" />
			</a>
		{:else}
			<h2 class="text-ltext short:text-3xl text-2xl md:text-5xl">{sectionName}</h2>
		{/if}
		{#if sectionLink}
			<div class="short:text-lg flex space-x-8 text-lg md:text-3xl">
				<button
					onclick={() => smoothScrollTo(sectionLink, 1500)}
					class="text-ltext cursor-pointer transition-all duration-300 ease-in-out hover:underline"
				>
					{linkText}
					<i class="short:text-base fa text-base md:text-2xl fa-arrow-{arrowDirection}"></i>
				</button>
			</div>
		{/if}
	</div>
</div>
