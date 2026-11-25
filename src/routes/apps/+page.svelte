<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import FloatingApps from '$lib/components/elements/FloatingApps.svelte';
  import HomeLink from '$lib/components/elements/HomeLink.svelte';
  import appsData from '$lib/data/apps.json';

  // Timings for going back home, in ms
  const FADE_OUT = 700; // everything on this page fades out
  const GAP = 350; // then a moment of empty page before the home page fades in

  // Arriving from the home page's transition, the dots are already showing
  const fromHome = page.state.fromHome === true;

  let leaving = $state(false);

  function toHome(e: MouseEvent) {
    // Let new-tab clicks and reduced-motion users navigate normally
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    setTimeout(() => goto('/', { state: { fromApps: true } }), FADE_OUT + GAP);
  }
</script>

<svelte:head>
  <title>apps - tomkane</title>
  <meta name="description" content="Apps by Tom Kane" />
</svelte:head>

<main class="h-svh bg-apps-bg font-serif text-neutral-200">
  <FloatingApps apps={appsData.apps} dotsInstant={fromHome} {leaving} fadeOutMs={FADE_OUT}>
    <HomeLink data-obstacle onclick={toHome} />
  </FloatingApps>
</main>
