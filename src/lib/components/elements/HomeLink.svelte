<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import HouseIcon from './HouseIcon.svelte';

	// Faint house icon pinned to the top-left corner. Shared by the landing page
	// (as a decoration that fades in during the transition) and /apps (as the
	// link home), so it sits in exactly the same place on both.
	interface Props extends HTMLAttributes<HTMLElement> {
		/** Render as a link to the home page; otherwise a plain decoration */
		link?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { link = true, onclick, class: extra = '', ...rest }: Props = $props();

	const classes =
		'absolute top-3 left-3 rounded-full p-3 text-neutral-200/25 transition-colors duration-300 md:top-5 md:left-5';
</script>

{#snippet icon()}
	<HouseIcon class="h-6 w-6 md:h-7 md:w-7" />
{/snippet}

{#if link}
	<a
		href="/"
		aria-label="Home"
		{onclick}
		class="{classes} hover:text-neutral-200/70 {extra}"
		{...rest}
	>
		{@render icon()}
	</a>
{:else}
	<span aria-hidden="true" class="{classes} {extra}" {...rest}>
		{@render icon()}
	</span>
{/if}
