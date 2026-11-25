<script lang="ts">
  import FloatingApps from '$lib/components/elements/FloatingApps.svelte';
  import appsData from '$lib/data/apps.json';
</script>

<svelte:head>
  <title>apps - tomkane</title>
  <meta name="description" content="Apps by Tom Kane" />
</svelte:head>

<main class="h-svh bg-apps-bg font-serif text-neutral-200">
  <FloatingApps apps={appsData.apps}>
    <a
      href="/"
      aria-label="Home"
      data-obstacle
      class="absolute top-3 left-3 rounded-full p-3 text-neutral-200/25 transition-colors duration-300 hover:text-neutral-200/70 md:top-5 md:left-5"
    >
      <!-- Lucide "house" icon (https://lucide.dev, ISC licence) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6 md:h-7 md:w-7"
        aria-hidden="true"
      >
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    </a>
  </FloatingApps>
</main>
