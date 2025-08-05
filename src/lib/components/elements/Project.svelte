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

  $: imageSrc = `src/lib/assets/project-images/${imageName}`;
</script>

<div class="bg-lbackground bg-opacity-10 border-2 border-cborder backdrop-blur-sm overflow-hidden hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 shadow-lg">
  <div class="flex flex-col sm:flex-row">
    <!-- Project Image -->
    <div class="relative overflow-hidden sm:w-1/3">
      <img
        src={imageSrc}
        alt={name}
        class="w-full h-48 aspect-square sm:h-full object-cover"
      />
      <div class="absolute inset-0 bg-ctextbg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <!-- Project Content -->
    <div class="p-6 sm:w-2/3 flex flex-col justify-between">
      <div>
        <h3 class="text-4xl font-bold mb-3 text-ctext">{name}</h3>
        <p class="text-2xl text-ctext mb-6 leading-relaxed">{description}</p>
        <TechStack stack={techStack}></TechStack>
      </div>
      
      <div class="flex gap-3">

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
</div>