<script lang="ts">
  import { onDestroy } from 'svelte';
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
</script>

<!-- Head -->
<svelte:head>
  <title>tomkane</title>
  <meta name="description" content="my portfolio" />
</svelte:head>

<!-- Ensure custom color classes -->
<ColorTrigger/>

<!-- Page -->
<div class="min-w-[800px] text-dtext font-serif">

  <!-- Home -->
  <section class="h-screen bg-lbackground" id="home">
    <StickyHeader
      sectionName="Home"
      headerColor="primary"
      sectionLink="contact"
      linkText="Contact"
      arrowDirection="down"
    />

    <div class="flex-1 overflow-y-auto px-4 py-6">
      <div class="pt-40 text-center">
        <h1 class="mb-6 text-6xl font-bold md:text-8xl">{info.myName}</h1>
        <p class="mb-8 text-4xl md:text-6xl">{info.myTagline}</p>
        <Icons {info} />
      </div>
    </div>
  </section>

  <!-- About -->
  <section class="min-h-screen bg-lbackground" id="about">
    <StickyHeader sectionName="About" headerColor="secondary" />

    <div class="mx-auto px-8 pt-16 pb-8">
      <div class="grid items-center gap-12 md:grid-cols-2">
        <div class="space-y-8 pl-5">

          <div class="p-3">
            <h3 class="mb-10 text-5xl font-bold">Hi there!</h3>
            <p class="mb-6 text-2xl leading-relaxed">
              {info.myBio}
            </p>
          </div>
          <div class="p-3 text-xl space-y-1 font-mono">
            <p>email: {info.myEmail}</p>
            <p>location: London</p>
          </div>
        </div>
        
        <div class="space-y-8 font-mono mt-8">
          <div class="p-3">
            <h4 class="mb-4 text-2xl font-semibold">tech</h4>
            <Tech />
          </div>
          <div class="p-3">
            <h4 class="mb-4 text-2xl font-semibold">aws journey</h4>
            <Certifications />
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Projects -->
  <section class="min-h-screen bg-lbackground" id="projects">
    <StickyHeader sectionName="Projects" headerColor="tertiary" />

    <div class="px-4 pt-16 pb-35">
      <div class="mx-auto max-w-7xl px-4">
        <div class="grid gap-8">
          {#each projects as project}
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
  <section class="flex h-screen flex-col bg-lbackground" id="contact">

    <StickyHeader
      sectionName="Contact"
      headerColor="quaternary"
      sectionLink="home"
      linkText="Back to top"
      arrowDirection="up"
    />

    <div class="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div class="flex flex-1 items-center justify-center">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="mb-8 text-4xl font-bold leading-tight md:text-6xl">
            I'm looking for new 
            <span class="text-primary">opportunities</span>, 
            please get in touch!
          </h1>
          
          <div class="relative inline-block mr-2">
            <button 
              on:click={() => copyTextStore.copyToClipboard(info.myEmail)}
              class="cursor-pointer rounded-lg bg-primary px-8 py-4 text-2xl font-semibold text-ltext shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-80 hover:shadow-xl"
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
           
          <div class="relative inline-block mr-2">
            <button 
              on:click={() => downloadFile(`/src/lib/assets/files/${info.cvFilename}`)}
              class="cursor-pointer rounded-lg bg-secondary px-8 py-4 text-2xl font-semibold text-ltext shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-80 hover:shadow-xl"
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
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    margin: 0;
  }
</style>