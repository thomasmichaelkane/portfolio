<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import HomeLink from '$lib/components/elements/HomeLink.svelte';
  import { drawShimmer } from '$lib/utils/shimmer';

  // Timings for leaving to another page, in ms
  const OTHERS_FADE = 250; // the name and other link fade out
  const CHOSEN_HOLD = 400; // the clicked link lingers this long...
  const CHOSEN_FADE = 1200; // ...then fades out (with /apps, while the dots fade in)
  const ARRIVE_FADE = 900; // content fading back in when returning from another page

  type Destination = 'about' | 'apps';
  let leavingTo: Destination | null = $state(null);
  let canvas: HTMLCanvasElement;
  let dotsFrame = 0;

  // The content always fades in: on first load, and when returning from another page
  let arriving = $state(true);

  onMount(() => {
    // Wait a frame so the hidden state is painted before the fade starts
    if (arriving) requestAnimationFrame(() => requestAnimationFrame(() => (arriving = false)));
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

  function leave(e: MouseEvent, to: Destination) {
    // Let new-tab clicks and reduced-motion users navigate normally
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (leavingTo) return;
    leavingTo = to;
    if (to === 'apps') runDots();
    const state = to === 'apps' ? { fromHome: true } : { fadeIn: true };
    setTimeout(() => goto(`/${to}`, { state }), CHOSEN_HOLD + CHOSEN_FADE);
  }

  // The clicked link lingers and fades slowly; everything else fades quickly
  type Part = Destination | 'name';
  const delay = (part: Part) => (leavingTo === part ? `${CHOSEN_HOLD}ms` : '0ms');
  const duration = (part: Part) => (leavingTo === part ? `${CHOSEN_FADE}ms` : `${OTHERS_FADE}ms`);
</script>

<svelte:head>
  <title>tomkane</title>
  <meta name="description" content="Tom Kane" />
  <!-- The text starts hidden and is faded in by script; without script, just show it -->
  <noscript><style>.soft { opacity: 1 !important; }</style></noscript>
</svelte:head>

<main
  class="relative flex h-svh flex-col items-center justify-center overflow-hidden bg-apps-bg font-fraunces text-neutral-200 lowercase"
>
  <canvas
    bind:this={canvas}
    class="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity ease-in"
    class:opacity-100={leavingTo === 'apps'}
    style:transition-delay="{CHOSEN_HOLD}ms"
    style:transition-duration="{CHOSEN_FADE}ms"
    aria-hidden="true"
  ></canvas>

  <!-- The /apps home icon, fading in with the dots so it's already there on arrival -->
  <HomeLink
    link={false}
    class="opacity-0 transition-opacity ease-in {leavingTo === 'apps' ? 'opacity-100' : ''}"
    style="transition-delay: {CHOSEN_HOLD}ms; transition-duration: {CHOSEN_FADE}ms"
  />

  <div
    class="soft relative flex flex-col items-center transition-opacity"
    class:opacity-0={arriving}
    style:transition-duration="{ARRIVE_FADE}ms"
  >
    <h1
      class="mb-10 text-6xl font-medium transition-opacity md:mb-14 md:text-8xl"
      class:opacity-0={leavingTo}
      style:transition-delay={delay('name')}
      style:transition-duration={duration('name')}
    >
      Tom Kane
    </h1>

    <nav class="flex gap-12 text-3xl md:gap-16 md:text-4xl">
      {#each ['about', 'apps'] as const as link}
        <a
          href="/{link}"
          onclick={(e) => leave(e, link)}
          class="transition-[color,opacity] hover:text-neutral-200"
          class:text-neutral-400={leavingTo !== link}
          class:opacity-0={leavingTo}
          style:transition-delay={delay(link)}
          style:transition-duration={duration(link)}
        >
          {link}
        </a>
      {/each}
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
