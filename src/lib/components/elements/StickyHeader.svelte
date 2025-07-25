<script lang="ts">
  import { smoothScrollTo } from '$lib/utils/scroll';
  
  export let sectionName: string;
  export let headerColor: string;
  export let sectionLink: string | undefined = undefined;
  export let linkText: string | undefined = undefined;
  export let arrowDirection: string | undefined = undefined;
  
</script>

<div class="sticky top-0 z-50 h-18 bg-{headerColor}">
  <div class="mx-auto px-2 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
    <h2 class="text-ltext text-5xl">{sectionName}</h2>
    {#if sectionLink}
      <div class="hidden md:flex space-x-8 text-3xl">
        <button on:click={() => smoothScrollTo(sectionLink, 1500)} class="text-ltext hover:text-htext transition-colors cursor-pointer">
          {linkText}
          <i class="text-2xl fa fa-arrow-{arrowDirection}"></i>
        </button>
      </div>
    {/if}
  </div>
</div>