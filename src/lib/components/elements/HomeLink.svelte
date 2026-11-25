<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  // Faint house icon pinned to the top-left corner. Shared by the landing page
  // (as a decoration that fades in during the transition) and /apps (as the
  // link home), so it sits in exactly the same place on both.
  interface Props extends HTMLAttributes<HTMLElement> {
    /** Render as a link to the home page; otherwise a plain decoration */
    link?: boolean;
    onclick?: (e: MouseEvent) => void;
  }

  let { link = true, onclick, class: extra = '', ...rest }: Props = $props();

  const classes =
    'absolute top-3 left-3 rounded-full p-3 text-neutral-200/25 transition-colors duration-300 md:top-5 md:left-5';
</script>

{#snippet icon()}
  <!-- Lucide "house" icon (https://lucide.dev, ISC licence) -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-6 w-6 md:h-7 md:w-7"
    aria-hidden="true"
  >
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path
      d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    />
  </svg>
{/snippet}

{#if link}
  <a href="/" aria-label="Home" {onclick} class="{classes} hover:text-neutral-200/70 {extra}" {...rest}>
    {@render icon()}
  </a>
{:else}
  <span aria-hidden="true" class="{classes} {extra}" {...rest}>
    {@render icon()}
  </span>
{/if}
