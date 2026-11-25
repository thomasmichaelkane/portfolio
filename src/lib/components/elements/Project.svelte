<script lang="ts">
	import TechStack from '../subsections/TechStack.svelte';
	import CopyButton from './CopyButton.svelte';
	import LinkButton from './LinkButton.svelte';

	export let name: string;
	export let description: string;
	export let imageName: string;
	export let techStack: any = []; // Array of technology strings
	export let githubUrl: string;
	export let buttonType: string | null = null;
	export let buttonLink: string;

	$: imageSrc = `/project-images/${imageName}`;
</script>

<div
	class="bg-lbackground bg-opacity-10 border-cborder hover:bg-opacity-20 transform overflow-hidden border-2 shadow-lg backdrop-blur-sm transition-all duration-300 md:hover:scale-105"
>
	<!--
    Grid of three blocks: image, text, buttons.
    phone portrait: stacked | sm+: image left spanning both rows, buttons under text
    phone landscape (short): image top-left beside text, buttons full width underneath
  -->
	<div class="grid grid-cols-1 sm:grid-cols-3 sm:grid-rows-[1fr_auto]">
		<!-- Project Image -->
		<div
			class="short:row-span-1 short:block short:self-start relative overflow-hidden sm:row-span-2 sm:flex sm:items-center lg:block"
		>
			<img src={imageSrc} alt={name} class="h-auto w-full lg:h-full lg:object-cover" />
			<div
				class="bg-ctext/20 absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
			></div>
		</div>

		<!-- Project Text -->
		<div class="px-4 pt-4 sm:col-span-2 md:px-6 md:pt-6">
			<h3 class="short:text-2xl text-ctext mb-3 text-2xl font-bold md:text-4xl">{name}</h3>
			<p class="short:text-base text-ctext mb-6 text-base leading-relaxed md:text-2xl">
				{description}
			</p>
			<TechStack stack={techStack}></TechStack>
		</div>

		<!-- Project Buttons -->
		<div
			class="short:col-span-3 flex flex-col gap-3 px-4 pt-6 pb-4 sm:col-span-2 sm:flex-row md:px-6 md:pb-6"
		>
			<LinkButton
				url={githubUrl}
				text="View Code"
				color="github"
				hcolor="primary"
				iconClass="fab fa-github"
			/>

			{#if buttonType == 'site'}
				<LinkButton
					url={buttonLink}
					text="Visit Site"
					color="site"
					hcolor="primary"
					iconClass="fas fa-link"
				/>
			{/if}

			{#if buttonType == 'docker'}
				<CopyButton
					command={buttonLink}
					text="Copy"
					color="docker"
					hcolor="primary"
					iconClass="fab fa-docker"
				/>
			{/if}
		</div>
	</div>
</div>
