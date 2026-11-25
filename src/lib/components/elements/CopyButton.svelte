<script lang="ts">
	import { onDestroy } from 'svelte';
	import { copyTextStore } from '$lib/utils/copy';

	export let command: string;
	export let text: string;
	export let color: string;
	export let hcolor: string;
	export let iconClass: string;

	onDestroy(() => {
		copyTextStore.cleanup();
	});
</script>

<button
	on:click={() => copyTextStore.copyToClipboard(command)}
	class="flex-1 bg-{color} hover:bg-{hcolor} short:text-base text-ltext transform cursor-pointer px-4 py-3 text-center text-base font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:text-xl"
>
	<span class="flex items-center justify-center gap-2">
		<i class={iconClass}></i>
		{text}
	</span>
</button>
