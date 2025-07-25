<script lang="ts">
  export let imageSrc: string;
  export let alt: string = 'Badge';
  export let width: number = 150;
  export let height: number = 150;
  export let tooltip: boolean;

</script>

<div class="inline-block group relative">
  <img
    src={imageSrc}
    {alt}
    width={width}
    height={height}
    class="grayscale brightness-75 opacity-60"
  />
  {#if tooltip}
    <div class="absolute left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-2 text-sm text-dtext opacity-0 group-hover:opacity-80 transition-opacity z-10">
      In progress!
    </div>
  {/if}
</div>