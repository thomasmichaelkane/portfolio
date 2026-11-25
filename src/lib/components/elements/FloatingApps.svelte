<script lang="ts">
  import { onMount } from 'svelte';
  import App from './App.svelte';
  import { drawShimmer, hexToRgb, type LightSource } from '$lib/utils/shimmer';

  interface AppInfo {
    name: string;
    logoSrc: string;
    playStoreUrl: string;
    accent: string; // hex colour of the app's glow on the background
  }

  let { apps }: { apps: AppInfo[] } = $props();

  // Tuning: speeds in px/s, times in seconds
  const MIN_SPEED = 12;
  const MAX_SPEED = 30;
  const WANDER = 10; // random drift acceleration
  const BOB_PX = 7; // vertical bob amplitude
  const TILT_DEG = 4; // rotation wobble amplitude
  const SETTLE_RATE = 3.5; // how quickly a hovered app comes to rest
  const SPACING = 32; // minimum clear space kept between apps
  const APP_LIGHT_RADIUS = 240; // how far an app's glow and ripples reach
  const MOUSE_LIGHT_RADIUS = 130;

  interface Body {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    r: number; // collision radius, covering the logo and name
    phase: number;
    calm: number; // 0 = floating freely, 1 = fully settled
    rgb: [number, number, number];
  }

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let items: HTMLDivElement[] = $state([]);
  let active: number | null = $state(null);
  let ready = $state(false);

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    const bodies: Body[] = items.map((_, i) => ({
      x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0, r: 0,
      phase: Math.random() * Math.PI * 2,
      calm: 0,
      rgb: hexToRgb(apps[i].accent)
    }));

    // Pointer as a light: eased position, fades in/out, ripples with speed
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, presence: 0, inside: false, speed: 0 };

    let W = 0;
    let H = 0;
    let edge = 16; // keep apps this far from the page edges

    const measure = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      edge = W < 768 ? 16 : 32;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      items.forEach((el, i) => {
        const b = bodies[i];
        b.w = el.offsetWidth;
        b.h = el.offsetHeight;
        b.r = Math.max(b.w, b.h) / 2;
        b.x = Math.min(Math.max(b.x, edge), Math.max(W - b.w - edge, edge));
        b.y = Math.min(Math.max(b.y, edge), Math.max(H - b.h - edge, edge));
      });
    };

    const bob = (b: Body, t: number) => Math.sin(t * 1.1 + b.phase) * BOB_PX * (1 - b.calm);

    const render = (t: number) => {
      bodies.forEach((b, i) => {
        const tilt = Math.sin(t * 0.7 + b.phase) * TILT_DEG * (1 - b.calm);
        items[i].style.transform = `translate3d(${b.x}px, ${b.y + bob(b, t)}px, 0) rotate(${tilt}deg)`;
      });

      // Lights sit on the centre of each logo (the square top part of the app)
      const lights: LightSource[] = bodies.map((b) => ({
        x: b.x + b.w / 2,
        y: b.y + b.w / 2 + bob(b, t),
        radius: APP_LIGHT_RADIUS,
        strength: 0.55 + 0.45 * b.calm, // brighter when settled
        ripple: 1 - 0.85 * b.calm, // water stills when settled
        rgb: b.rgb
      }));
      if (mouse.presence > 0.01) {
        lights.push({
          x: mouse.x,
          y: mouse.y,
          radius: MOUSE_LIGHT_RADIUS,
          strength: 0.25 * mouse.presence,
          ripple: Math.min(mouse.speed / 600, 0.5) * mouse.presence,
          rgb: [240, 236, 230]
        });
      }
      drawShimmer(ctx, W, H, t, lights);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      if (!mouse.inside) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      }
      mouse.inside = true;
    };
    const onPointerLeave = () => (mouse.inside = false);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const observer = new ResizeObserver(() => {
      measure();
      render(performance.now() / 1000);
    });

    measure();

    // Reduced motion: centred row, a still background, no animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const gap = 48;
      const total = bodies.reduce((sum, b) => sum + b.w, 0) + gap * (bodies.length - 1);
      let x = (W - total) / 2;
      bodies.forEach((b) => {
        b.x = x;
        b.y = (H - b.h) / 2;
        b.calm = 1;
        x += b.w + gap;
      });
      render(0);
      observer.observe(container);
      ready = true;
      return () => {
        observer.disconnect();
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
      };
    }

    // Random, non-overlapping starting positions with random headings
    bodies.forEach((b, i) => {
      for (let attempt = 0; attempt < 100; attempt++) {
        b.x = edge + Math.random() * Math.max(W - b.w - 2 * edge, 0);
        b.y = edge + Math.random() * Math.max(H - b.h - 2 * edge, 0);
        const clear = bodies.slice(0, i).every(
          (o) => Math.hypot(b.x + b.w / 2 - (o.x + o.w / 2), b.y + b.h / 2 - (o.y + o.h / 2)) > b.r + o.r + SPACING
        );
        if (clear) break;
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
      b.vx = Math.cos(angle) * speed;
      b.vy = Math.sin(angle) * speed;
    });

    let last = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Ease the pointer light towards the pointer, tracking its speed for the wake
      const ease = 1 - Math.exp(-dt * 10);
      const mx = (mouse.targetX - mouse.x) * ease;
      const my = (mouse.targetY - mouse.y) * ease;
      mouse.x += mx;
      mouse.y += my;
      mouse.speed += (Math.hypot(mx, my) / (dt || 1 / 60) - mouse.speed) * (1 - Math.exp(-dt * 4));
      mouse.presence += ((mouse.inside ? 1 : 0) - mouse.presence) * (1 - Math.exp(-dt * 3));

      bodies.forEach((b, i) => {
        // Ease towards settled while hovered, and back to floating after
        const target = active === i ? 1 : 0;
        b.calm += (target - b.calm) * (1 - Math.exp(-dt * SETTLE_RATE));
        const free = 1 - b.calm;

        // Gentle random wander, kept within a speed range
        b.vx += (Math.random() - 0.5) * WANDER * dt * 2;
        b.vy += (Math.random() - 0.5) * WANDER * dt * 2;
        const speed = Math.hypot(b.vx, b.vy) || 1;
        const clamped = Math.min(Math.max(speed, MIN_SPEED), MAX_SPEED);
        b.vx = (b.vx / speed) * clamped;
        b.vy = (b.vy / speed) * clamped;

        b.x += b.vx * dt * free;
        b.y += b.vy * dt * free;

        // Bounce softly off the edges
        if (b.x < edge) { b.x = edge; b.vx = Math.abs(b.vx); }
        if (b.y < edge) { b.y = edge; b.vy = Math.abs(b.vy); }
        if (b.x > W - b.w - edge) { b.x = W - b.w - edge; b.vx = -Math.abs(b.vx); }
        if (b.y > H - b.h - edge) { b.y = H - b.h - edge; b.vy = -Math.abs(b.vy); }
      });

      // Apps bump off each other; a settled app stays put
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x + b.w / 2 - (a.x + a.w / 2);
          const dy = b.y + b.h / 2 - (a.y + a.h / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const overlap = a.r + b.r + SPACING - dist;
          if (overlap <= 0) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const aMoves = 1 - a.calm;
          const bMoves = 1 - b.calm;
          const total = aMoves + bMoves || 1;
          a.x -= nx * overlap * (aMoves / total);
          a.y -= ny * overlap * (aMoves / total);
          b.x += nx * overlap * (bMoves / total);
          b.y += ny * overlap * (bMoves / total);
          // Turn each app away from the other
          const aDot = a.vx * nx + a.vy * ny;
          if (aDot > 0) { a.vx -= 2 * aDot * nx; a.vy -= 2 * aDot * ny; }
          const bDot = b.vx * nx + b.vy * ny;
          if (bDot < 0) { b.vx -= 2 * bDot * nx; b.vy -= 2 * bDot * ny; }
        }
      }

      render(now / 1000);
      frame = requestAnimationFrame(step);
    };

    render(0);
    observer.observe(container);
    ready = true;
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  });
</script>

<div
  bind:this={container}
  class="relative h-full w-full overflow-hidden transition-opacity duration-700"
  class:opacity-0={!ready}
>
  <canvas bind:this={canvas} class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true"></canvas>

  {#each apps as app, i}
    <div
      bind:this={items[i]}
      class="absolute top-0 left-0 will-change-transform"
      role="presentation"
      onmouseenter={() => (active = i)}
      onmouseleave={() => (active = null)}
      onfocusin={() => (active = i)}
      onfocusout={() => (active = null)}
    >
      <App name={app.name} logoSrc={app.logoSrc} playStoreUrl={app.playStoreUrl} color={app.accent} active={active === i} />
    </div>
  {/each}
</div>
