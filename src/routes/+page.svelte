<script lang="ts">
  import { goto } from '$app/navigation';
  import { drawShimmer } from '$lib/utils/shimmer';

  // Timings for the hand-off to /apps, in ms
  const OTHERS_FADE = 250; // name and other links fade out
  const APPS_HOLD = 400; // "apps" lingers this long...
  const APPS_FADE = 650; // ...then fades out while the dots fade in

  let leaving = $state(false);
  let canvas: HTMLCanvasElement;

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
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
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

<main class="relative flex h-svh flex-col items-center justify-center overflow-hidden bg-apps-bg font-fraunces text-neutral-200 lowercase">
  <canvas
    bind:this={canvas}
    class="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity ease-in"
    class:opacity-100={leaving}
    style:transition-delay="{APPS_HOLD}ms"
    style:transition-duration="{APPS_FADE}ms"
    aria-hidden="true"
  ></canvas>

  <div class="soft relative flex flex-col items-center">
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
