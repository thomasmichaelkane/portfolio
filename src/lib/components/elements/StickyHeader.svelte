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
  
</script>

<div class="sticky top-0 z-50 h-12 md:h-18 short:h-12 bg-{headerColor}">
  <div class="mx-auto px-4 sm:px-6 lg:px-8 py-2 h-full flex justify-between items-center">
    {#if home}
      <a
        href="/"
        aria-label="Home"
        class="text-ltext transition-transform duration-200 ease-out hover:scale-115 focus-visible:scale-115"
      >
        <HouseIcon class="h-7 w-7 md:h-11 md:w-11 short:h-7 short:w-7" />
      </a>
    {:else}
      <h2 class="text-ltext text-2xl md:text-5xl short:text-3xl">{sectionName}</h2>
    {/if}
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