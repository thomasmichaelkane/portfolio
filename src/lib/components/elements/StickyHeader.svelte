<script lang="ts">
  import { smoothScrollTo } from '$lib/utils/scroll';
  
  export let sectionName: string;
  export let headerColor: string;
  export let sectionLink: string | undefined = undefined;
  export let linkText: string | undefined = undefined;
  export let arrowDirection: string | undefined = undefined;
  
</script>

<div class="sticky top-0 z-50 h-12 md:h-18 short:h-12 bg-{headerColor}">
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-2 h-full flex justify-between items-center">
    <h2 class="text-ltext text-2xl md:text-5xl short:text-3xl">{sectionName}</h2>
    {#if sectionLink}
      <div class="flex space-x-8 text-lg md:text-3xl short:text-lg">
        <button onclick={() => smoothScrollTo(sectionLink, 1500)} class="text-ltext cursor-pointer hover:underline transition-all duration-300 ease-in-out">
          {linkText}
          <i class="text-base md:text-2xl short:text-base fa fa-arrow-{arrowDirection}"></i>
        </button>
      </div>
    {/if}
  </div>
</div>