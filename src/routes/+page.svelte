<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import HomeLink from '$lib/components/elements/HomeLink.svelte';
  import { drawShimmer } from '$lib/utils/shimmer';
  import { dissolve } from '$lib/utils/pixelate';

  // Timings for the hand-off to /apps, in ms
  const OTHERS_FADE = 250; // name and other links fade out
  const APPS_HOLD = 400; // "apps" lingers this long...
  const APPS_FADE = 1200; // ...then fades out while the dots fade in
  const ARRIVE_FADE = 900; // content fading back in when returning from /apps

  const DISSOLVE_OUT = 700; // pixel-dissolve out to /about, ms

  let leaving = $state(false);
  let pixelating = false;
  let canvas: HTMLCanvasElement;
  let mainEl: HTMLElement;
  let dotsFrame = 0;

  // Returning from /apps (which has already faded out), fade the content in
  let arriving = $state(page.state.fromApps === true);

  onMount(() => {
    if (arriving) {
      // Wait a frame so the hidden state is painted before the fade starts
      requestAnimationFrame(() => requestAnimationFrame(() => (arriving = false)));
    }
    return () => cancelAnimationFrame(dotsFrame);
  });

  // Draw the same dot field as /apps (no lights yet) so the hand-off is seamless
  function runDots() {
    const ctx = canvas.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const frame = (now: number) => {
      drawShimmer(ctx, W, H, now / 1000, []);
      dotsFrame = requestAnimationFrame(frame);
    };
    dotsFrame = requestAnimationFrame(frame);
  }

  async function toAbout(e: MouseEvent) {
    // Let new-tab clicks and reduced-motion users navigate normally
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (leaving || pixelating) return;
    pixelating = true;
    await dissolve(mainEl, { from: 0, to: 1, duration: DISSOLVE_OUT, background: 'var(--color-apps-bg)' });
    goto('/about', { state: { pixelIn: true } });
  }

  function toApps(e: MouseEvent) {
    // Let new-tab clicks and reduced-motion users navigate normally
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    runDots();
    setTimeout(() => goto('/apps', { state: { fromHome: true } }), APPS_HOLD + APPS_FADE);
  }
</script>

<svelte:head>
  <title>tomkane</title>
  <meta name="description" content="Tom Kane" />
</svelte:head>

<main
  bind:this={mainEl}
  class="relative flex h-svh flex-col items-center justify-center overflow-hidden bg-apps-bg font-fraunces text-neutral-200 lowercase">
  <canvas
    bind:this={canvas}
    class="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity ease-in"
    class:opacity-100={leaving}
    style:transition-delay="{APPS_HOLD}ms"
    style:transition-duration="{APPS_FADE}ms"
    aria-hidden="true"
  ></canvas>

  <!-- The /apps home icon, fading in with the dots so it's already there on arrival -->
  <HomeLink
    link={false}
    class="opacity-0 transition-opacity ease-in {leaving ? 'opacity-100' : ''}"
    style="transition-delay: {APPS_HOLD}ms; transition-duration: {APPS_FADE}ms"
  />

  <div
    class="soft relative flex flex-col items-center transition-opacity"
    class:opacity-0={arriving}
    style:transition-duration="{ARRIVE_FADE}ms"
  >
    <h1
      class="mb-10 text-6xl font-medium transition-opacity md:mb-14 md:text-8xl"
      class:opacity-0={leaving}
      style:transition-duration="{OTHERS_FADE}ms"
    >
      Tom Kane
    </h1>

    <nav class="flex gap-12 text-3xl md:gap-16 md:text-4xl">
      <a
        href="/about"
        onclick={toAbout}
        class="text-neutral-400 transition-[color,opacity] hover:text-neutral-200"
        class:opacity-0={leaving}
        style:transition-duration="{OTHERS_FADE}ms"
      >
        about
      </a>
      <a
        href="/apps"
        onclick={toApps}
        class="transition-[color,opacity] hover:text-neutral-200"
        class:text-neutral-400={!leaving}
        class:opacity-0={leaving}
        style:transition-delay={leaving ? `${APPS_HOLD}ms` : '0ms'}
        style:transition-duration={leaving ? `${APPS_FADE}ms` : `${OTHERS_FADE}ms`}
      >
        apps
      </a>
    </nav>
  </div>
</main>

<style>
  /* Hestia's wordmark settings for Fraunces */
  .soft {
    font-variation-settings:
      'SOFT' 100,
      'opsz' 96;
    letter-spacing: -0.01em;
  }
</style>
