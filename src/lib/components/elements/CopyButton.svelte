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
  class="flex-1 bg-{color} hover:bg-{hcolor} text-xl text-ltext text-center py-3 px-4 transition-all duration-200 font-medium hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
>
  <span class="flex items-center justify-center gap-2">
    <i class="{iconClass}"></i>
    {text}
  </span>
</button>