<script lang="ts">
  export let stack;
</script>

<div class="mb-6 font-mono">
  <h4 class="text-l font-semibold text-ctext mb-3 uppercase tracking-wide">Stack</h4>
  <div class="flex flex-wrap gap-2">
    {#each stack as tech}
      <span class="border-1 border-dtext bg-opacity-80 text-dtext px-3 py-1 text-m font-medium hover:bg-opacity-100 transition-all duration-200">
        {tech}
      </span>
    {/each}
  </div>
</div>