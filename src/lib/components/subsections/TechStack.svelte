<script lang="ts">
  export let stack;
</script>

<div class="mb-6 font-mono">
  <h4 class="text-sm md:text-base short:text-sm font-semibold text-ctext mb-3 uppercase tracking-wide">Stack</h4>
  <div class="flex flex-wrap gap-2">
    {#each stack as tech}
      <span class="border-1 border-dtext bg-opacity-80 text-dtext px-2 py-0.5 text-sm md:px-3 md:py-1 md:text-base short:px-2 short:py-0.5 short:text-sm font-medium hover:bg-opacity-100 transition-all duration-200">
        {tech}
      </span>
    {/each}
  </div>
</div>