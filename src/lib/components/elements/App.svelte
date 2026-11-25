<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    name: string;
    logoSrc: string;
    /** Play Store listing; leave null while the app isn't listed yet ("coming soon") */
    playStoreUrl: string | null;
    /** Colour of the name, matching the logo */
    color: string;
    /** Show the name (e.g. while hovered or focused). Touch screens always show it. */
    active?: boolean;
  }

  let { name, logoSrc, playStoreUrl, color, active = false }: Props = $props();

  // Touch screens can't hover, so a tap shows the "coming soon" tooltip for a moment
  const TAP_SHOW = 1600; // ms
  let tapped = $state(false);
  let tapTimer: ReturnType<typeof setTimeout> | undefined;
  function onTap() {
    tapped = true;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => (tapped = false), TAP_SHOW);
  }
  onDestroy(() => clearTimeout(tapTimer));

  // Keyboard focus ring around the logo (not shown for mouse or touch)
  const focusRing =
    'rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-500';
</script>

{#snippet logo()}
  <img src={logoSrc} alt="" draggable="false" class="h-20 w-20 rounded-2xl md:h-36 md:w-36" />
{/snippet}

<div class="flex w-20 flex-col items-center md:w-36">
  {#if playStoreUrl}
    <a
      href={playStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="{name} on Google Play"
      class="block {focusRing}"
    >
      {@render logo()}
    </a>
  {:else}
    <!-- Not listed yet: a button that only shows the tooltip (keyboard and touch too) -->
    <button
      type="button"
      aria-label="{name}, coming soon"
      class="block cursor-default {focusRing}"
      onclick={onTap}
    >
      {@render logo()}
    </button>
  {/if}

  <!-- Soft-edged patch of the page colour behind the name, so it reads over the dots -->
  <p
    class="name mt-1 px-5 py-2 font-fraunces text-xl font-medium md:mt-2 md:px-8 md:py-3 md:text-[2rem] whitespace-nowrap lowercase transition-opacity duration-500 [@media(hover:none)]:opacity-100"
    class:opacity-0={!active}
    style:color
  >
    {name}
  </p>

  {#if !playStoreUrl}
    <!-- Below the name, in the layout, so the app's size accounts for it while shown -->
    <p
      class="soon -mt-1 rounded-full px-3 py-1 font-fraunces text-sm whitespace-nowrap text-neutral-300 lowercase transition-opacity duration-300 md:mt-0 md:text-base"
      class:opacity-0={!(active || tapped)}
      aria-hidden="true"
    >
      coming soon
    </p>
  {/if}
</div>

<style>
  .name,
  .soon {
    /* Hestia's wordmark settings: fully "soft" letterforms at display size */
    font-variation-settings:
      'SOFT' 100,
      'opsz' 96;
    letter-spacing: -0.01em;
  }
  .name {
    background: radial-gradient(
      closest-side,
      var(--color-apps-bg) 55%,
      color-mix(in srgb, var(--color-apps-bg) 0%, transparent) 100%
    );
  }
  .soon {
    background: color-mix(in srgb, var(--color-apps-bg) 85%, white 8%);
    box-shadow: 0 0 0 1px color-mix(in srgb, white 10%, transparent);
  }
</style>
