<script lang="ts">
  import FloatingApps from '$lib/components/elements/FloatingApps.svelte';
  import appsData from '$lib/data/apps.json';
</script>

<svelte:head>
  <title>apps - tomkane</title>
  <meta name="description" content="Apps by Tom Kane" />
</svelte:head>

<main class="h-svh bg-[#161616] p-4 font-serif text-neutral-200 md:p-8">
  <FloatingApps apps={appsData.apps} />
</main>
