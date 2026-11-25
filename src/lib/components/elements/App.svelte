<script lang="ts">
  interface Props {
    name: string;
    logoSrc: string;
    playStoreUrl: string;
    /** Show the name (e.g. while hovered or focused). Touch screens always show it. */
    active?: boolean;
  }

  let { name, logoSrc, playStoreUrl, active = false }: Props = $props();
</script>

<div class="flex w-32 flex-col items-center md:w-40">
  <a
    href={playStoreUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="{name} on Google Play"
    class="block rounded-2xl"
  >
    <img src={logoSrc} alt="" draggable="false" class="h-32 w-32 rounded-2xl md:h-40 md:w-40" />
  </a>

  <p
    class="mt-4 text-2xl transition-opacity duration-500 md:text-3xl [@media(hover:none)]:opacity-100"
    class:opacity-0={!active}
  >
    {name}
  </p>
</div>
