<script lang="ts">
	export let stack;
</script>

<div class="font-mono">
	<div class="flex flex-wrap gap-2">
		{#each stack as tech}
			<span
				class="border-dtext bg-opacity-80 text-dtext short:px-2 short:py-0.5 short:text-sm hover:bg-opacity-100 border-1 px-2 py-0.5 text-sm font-medium transition-all duration-200 md:px-3 md:py-1 md:text-base"
			>
				{tech}
			</span>
		{/each}
	</div>
</div>
