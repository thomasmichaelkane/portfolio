<script lang="ts">
  import App from '$lib/components/elements/App.svelte';
  import appsData from '$lib/data/apps.json';
</script>

<svelte:head>
  <title>apps - tomkane</title>
  <meta name="description" content="Apps by Tom Kane" />
</svelte:head>

<div class="min-h-svh bg-lbackground px-4 py-6 font-serif text-dtext">
  <div class="pt-24 text-center md:pt-40">
    <h1 class="mb-12 text-5xl font-bold md:mb-16 md:text-8xl">Apps</h1>
    <div class="flex flex-wrap justify-center gap-12 md:gap-24">
      {#each appsData.apps as app}
        <App {...app} />
      {/each}
    </div>
  </div>
</div>
