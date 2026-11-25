<script lang="ts">
  interface Props {
    name: string;
    logoSrc: string;
    playStoreUrl: string;
    /** Colour of the name, matching the logo */
    color: string;
    /** Show the name (e.g. while hovered or focused). Touch screens always show it. */
    active?: boolean;
  }

  let { name, logoSrc, playStoreUrl, color, active = false }: Props = $props();
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

  <!-- Soft-edged patch of the page colour behind the name, so it reads over the dots -->
  <p
    class="name mt-2 px-8 py-3 font-fraunces text-3xl font-medium whitespace-nowrap lowercase transition-opacity duration-500 md:text-4xl [@media(hover:none)]:opacity-100"
    class:opacity-0={!active}
    style:color
  >
    {name}
  </p>
</div>

<style>
  .name {
    /* Hestia's wordmark settings: fully "soft" letterforms at display size */
    font-variation-settings:
      'SOFT' 100,
      'opsz' 96;
    letter-spacing: -0.01em;
    background: radial-gradient(
      closest-side,
      var(--color-apps-bg) 55%,
      color-mix(in srgb, var(--color-apps-bg) 0%, transparent) 100%
    );
  }
</style>
