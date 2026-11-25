<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { copyTextStore } from '$lib/utils/copy';
  import { downloadFile } from '$lib/utils/download';

  import StickyHeader from '$lib/components/elements/StickyHeader.svelte';
  import Icons from '$lib/components/subsections/Icons.svelte';
  import Tech from '$lib/components/subsections/Tech.svelte';
  import Certifications from '$lib/components/subsections/Certifications.svelte';
  import Project from '$lib/components/elements/Project.svelte';
	import ColorTrigger from '$lib/components/elements/ColorTrigger.svelte';
	import Footer from '$lib/components/elements/Footer.svelte';

  export let data: PageData;
  $: info = data.info;
  $: projects = data.projects;

  onDestroy(() => {
    copyTextStore.cleanup();
  });

  // Arriving from the home page, in stages (each starts when the last ends):
  //   0 hidden -> 1 the page fades up out of the dark -> 2 the text fades in
  //   -> 3 the top bar slides down -> 4 done, scrolling unlocked
  const FADE_IN = 650; // ms
  const TEXT_FADE = 300; // ms
  const BAR_SLIDE = 400; // ms
  const FADE_OUT = 900; // ms, going back home
  let stage = page.state.fromHome === true ? 0 : 4;
  let leaving = false;

  // Hold the page behind at the home page's grey while fading, so nothing flashes white
  const holdDarkBackground = (on: boolean) =>
    (document.documentElement.style.backgroundColor = on ? 'var(--color-apps-bg)' : '');
  const lockScroll = (on: boolean) => (document.documentElement.style.overflow = on ? 'hidden' : '');

  // Scroll hint: shown only while at the very top of the page
  let atTop = true;
  const onScroll = () => (atTop = window.scrollY <= 0);

  onMount(() => {
    // Gently snap to each section's start (its top bar) when scrolling stops nearby
    document.documentElement.style.scrollSnapType = 'y proximity';
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (stage === 0) {
      holdDarkBackground(true);
      lockScroll(true);
      // Wait a frame so the hidden state is painted before the fade starts
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          stage = 1;
          timers.push(
            setTimeout(() => (stage = 2), FADE_IN),
            setTimeout(() => (stage = 3), FADE_IN + TEXT_FADE),
            setTimeout(() => {
              stage = 4;
              lockScroll(false);
              holdDarkBackground(false);
            }, FADE_IN + TEXT_FADE + BAR_SLIDE)
          );
        })
      );
    }
    return () => {
      document.documentElement.style.scrollSnapType = '';
      window.removeEventListener('scroll', onScroll);
      timers.forEach(clearTimeout);
      holdDarkBackground(false);
      lockScroll(false);
    };
  });

  function toHome(e: MouseEvent) {
    // Let new-tab clicks and reduced-motion users navigate normally
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    holdDarkBackground(true);
    setTimeout(() => goto('/'), FADE_OUT);
  }
</script>

<!-- Head -->
<svelte:head>
  <title>about - tomkane</title>
  <meta name="description" content="my portfolio" />
</svelte:head>

<!-- Ensure custom color classes -->
<ColorTrigger/>

<!-- Page -->
<div class="text-dtext font-serif transition-opacity" class:opacity-0={stage < 1 || leaving} style:transition-duration="{leaving ? FADE_OUT : FADE_IN}ms">

  <!-- Home -->
  <section class="relative min-h-svh snap-start bg-lbackground" id="home">
    <StickyHeader
      sectionName="Home"
      home
      onHome={toHome}
      raised={stage < 3}
      slideMs={BAR_SLIDE}
      headerColor="primary"
      sectionLink="contact"
      linkText="Contact"
      arrowDirection="down"
    />

    <div class="flex-1 overflow-y-auto px-4 py-6">
      <div
        class="pt-24 text-center transition-opacity md:pt-40 short:pt-10"
        class:opacity-0={stage < 2}
        style:transition-duration="{TEXT_FADE}ms"
      >
        <h1 class="mb-6 text-4xl font-bold md:text-8xl short:mb-3 short:text-5xl">{info.myName}</h1>
        <p class="mb-8 text-2xl md:text-6xl short:mb-4 short:text-3xl">{info.myTagline}</p>
        <Icons {info} />
      </div>
    </div>

    <!-- Faint pulsing arrow hinting there's more below; hidden once scrolled at all -->
    <div
      class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center text-dtext/30 transition-opacity duration-500 md:bottom-10 short:bottom-3"
      class:opacity-0={!atTop || stage < 4}
      aria-hidden="true"
    >
      <!-- Lucide "chevron-down" icon (https://lucide.dev, ISC licence) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="scroll-hint h-8 w-8 md:h-10 md:w-10"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </section>

  <!-- About -->
  <section class="min-h-screen snap-start bg-lbackground" id="about">
    <StickyHeader sectionName="About" headerColor="secondary" />

    <div class="mx-auto px-4 pt-10 pb-8 md:px-8 md:pt-16">
      <div class="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div class="space-y-8 md:pl-5">

          <div class="p-3">
            <h3 class="mb-6 text-3xl font-bold md:mb-10 md:text-5xl short:mb-6 short:text-3xl">Hello!</h3>
            <p class="mb-6 text-base leading-relaxed md:text-2xl short:text-base">
              {info.myBio}
            </p>
          </div>
          <div class="p-3 text-base space-y-3 font-mono break-words lg:text-2xl short:text-base">
            <p>email: {info.myEmail}</p>
            <p>location: London</p>
          </div>
        </div>
        
        <div class="space-y-8 font-mono md:mt-8">
          <div class="p-3">
            <h4 class="mb-4 text-xl font-semibold md:text-2xl short:text-xl">tech</h4>
            <Tech />
          </div>
          <div class="p-3">
            <h4 class="mb-6 text-xl font-semibold md:mb-8 md:text-2xl short:mb-6 short:text-xl">aws journey</h4>
            <Certifications />
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Projects -->
  <section class="min-h-screen snap-start bg-lbackground" id="projects">
    <StickyHeader sectionName="Projects" headerColor="tertiary" />

    <div class="px-2 pt-10 pb-20 md:px-4 md:pt-16 md:pb-35">
      <div class="mx-auto max-w-7xl px-4">
        <div class="grid gap-8">
          {#each projects as project (project.id)}
            <Project 
              name={project.name}
              description={project.description}
              imageName={project.imageName}
              techStack={project.techStack}
              githubUrl={project.githubUrl}
              buttonType={project.buttonType}
              buttonLink={project.buttonLink}
            />
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="flex min-h-screen snap-start flex-col bg-lbackground" id="contact">

    <StickyHeader
      sectionName="Contact"
      headerColor="quaternary"
      sectionLink="home"
      linkText="Back to top"
      arrowDirection="up"
    />

    <div class="flex flex-1 flex-col px-4 py-6">
      <div class="flex flex-1 items-center justify-center">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="mb-8 text-2xl font-bold leading-tight md:text-6xl short:text-4xl">
            If you're 
            <span class="text-primary">interested</span>, 
            please get in touch.
          </h1>
          
          <div class="relative mb-3 block sm:mr-2 sm:inline-block">
            <button 
              on:click={() => copyTextStore.copyToClipboard(info.myEmail)}
              class="cursor-pointer rounded-lg bg-primary w-full px-6 py-3 text-lg font-semibold sm:w-auto md:px-8 md:py-4 md:text-2xl short:py-3 short:text-lg text-ltext shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-80 hover:shadow-xl"
            >
              Copy my email
            </button>
            
            {#if $copyTextStore.copied}
              <div
                class="bg-secondary pointer-events-none fixed z-50 -mt-2 -translate-x-1/2 -translate-y-full transform rounded bg-ctext px-3 py-1 text-sm text-ltext shadow-lg"
                style="left: {$copyTextStore.tooltipPosition.x}px; top: {$copyTextStore.tooltipPosition.y}px;"
              >
                Nice one!
              </div>
            {/if}
          </div>
           
          <div class="relative mb-3 block sm:mr-2 sm:inline-block">
            <button 
              on:click={() => downloadFile(`/${info.cvFilename}`)}
              class="cursor-pointer rounded-lg bg-secondary w-full px-6 py-3 text-lg font-semibold sm:w-auto md:px-8 md:py-4 md:text-2xl short:py-3 short:text-lg text-ltext shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-80 hover:shadow-xl"
            >
              Download my CV
            </button>
            
          </div>

        </div>
      </div>
      
      <Footer/>

    </div>
  </section>
</div>

<style>
  /* Gentle pulse for the scroll hint (off for reduced motion) */
  @media (prefers-reduced-motion: no-preference) {
    .scroll-hint {
      animation: scroll-hint 2.4s ease-in-out infinite;
    }
  }
  @keyframes scroll-hint {
    0%,
    100% {
      opacity: 0.45;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      transform: translateY(6px);
    }
  }

  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
  }
</style>