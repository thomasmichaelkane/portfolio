<script lang="ts">

  export let badgeName: string;
  export let imageSrc: string;
  export let alt: string = 'Badge';
  export let width: number = 60;
  export let height: number = 60;

</script>

<div class="inline-block m-5 transition-all duration-200 ease-in-out relative group">
  <div class="inline-block relative transition-transform duration-200 ease-in-out group-hover:scale-110">
    <img
      src={imageSrc}
      {alt}
      width={width}
      height={height}
      class="rounded-lg"
    />
    <div class="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-ctext text-cbackground px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible transition-all duration-200 ease-in-out pointer-events-none z-50 group-hover:opacity-100 group-hover:visible">
      {badgeName}
    </div>
  </div>
</div>