<script lang="ts">
  export let badgeId: string;
  export let imageSrc: string;
  export let alt: string = 'Badge';
  export let width: number = 150;
  export let height: number = 150;

  $: badgeUrl = `https://www.credly.com/badges/${badgeId}`;
</script>

<a 
  href={badgeUrl} 
  target="_blank" 
  rel="noopener noreferrer" 
  class="inline-block transition-transform duration-200 ease-in-out hover:scale-110"
>
  <img
    src={imageSrc}
    {alt}
    width={width}
    height={height}
    class="rounded-lg"
  />
</a>