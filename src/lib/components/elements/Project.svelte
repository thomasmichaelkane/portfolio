<script lang="ts">
	import TechStack from "../subsections/TechStack.svelte";
	import CopyButton from "./CopyButton.svelte";
	import LinkButton from "./LinkButton.svelte";

  export let name: string;
  export let description: string;
  export let imageName: string;
  export let techStack: any = []; // Array of technology strings
  export let githubUrl: string;
  export let buttonType: string | null = null;
  export let buttonLink: string;

  $: imageSrc = `/project-images/${imageName}`;
</script>

<div class="bg-lbackground bg-opacity-10 border-2 border-cborder backdrop-blur-sm overflow-hidden hover:bg-opacity-20 transition-all duration-300 transform md:hover:scale-105 shadow-lg">
  <!--
    Grid of three blocks: image, text, buttons.
    phone portrait: stacked | sm+: image left spanning both rows, buttons under text
    phone landscape (short): image top-left beside text, buttons full width underneath
  -->
  <div class="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-[1fr_auto]">
    <!-- Project Image -->
    <div class="relative overflow-hidden sm:row-span-2 sm:flex sm:items-center lg:block short:row-span-1 short:block short:self-start">
      <img
        src={imageSrc}
        alt={name}
        class="w-full h-auto lg:h-full lg:object-cover"
      />
      <div class="absolute inset-0 bg-ctext/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <!-- Project Text -->
    <div class="px-4 pt-4 sm:col-span-2 md:px-6 md:pt-6">
      <h3 class="text-2xl md:text-4xl short:text-2xl font-bold mb-3 text-ctext">{name}</h3>
      <p class="text-base md:text-2xl short:text-base text-ctext mb-6 leading-relaxed">{description}</p>
      <TechStack stack={techStack}></TechStack>
    </div>

    <!-- Project Buttons -->
    <div class="flex flex-col gap-3 px-4 pb-4 sm:col-span-2 sm:flex-row md:px-6 md:pb-6 short:col-span-3">

      <LinkButton
        url="{githubUrl}"
        text="View Code"
        color="github"
        hcolor="primary"
        iconClass="fab fa-github"
      />
      
      {#if buttonType == "site"}
        <LinkButton
          url="{buttonLink}"
          text="Visit Site"
          color="site"
          hcolor="primary"
          iconClass="fas fa-link"
        />
      {/if}

      {#if buttonType == "docker"}
        <CopyButton
          command="{buttonLink}"
          text="Copy Command"
          color="docker"
          hcolor="primary"
          iconClass="fab fa-docker"
        />
      {/if}

    </div>
  </div>
</div>