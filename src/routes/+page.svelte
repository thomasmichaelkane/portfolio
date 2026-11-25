<script lang="ts">
  // Landing page: navigation to the rest of the site.
  // Each destination styles itself; nothing here is shared with /about.
  const pages = [
    { href: '/about', title: 'About', blurb: 'Who I am, what I work with, projects and contact' },
    { href: '/apps', title: 'Apps', blurb: 'Things I have built and released' }
  ];
</script>

<svelte:head>
  <title>tomkane</title>
  <meta name="description" content="Tom Kane" />
</svelte:head>

<main class="flex min-h-svh flex-col items-center justify-center bg-lbackground px-6 py-16 font-serif text-dtext">
  <h1 class="mb-12 text-5xl font-bold md:mb-16 md:text-8xl">Tom Kane</h1>

  <nav class="grid w-full max-w-3xl gap-6 sm:grid-cols-2">
    {#each pages as page}
      <a
        href={page.href}
        class="group block border-2 border-cborder p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-8"
      >
        <h2 class="mb-2 flex items-center justify-between text-3xl font-bold md:text-4xl">
          {page.title}
          <i class="fa fa-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1"></i>
        </h2>
        <p class="font-mono text-base md:text-lg">{page.blurb}</p>
      </a>
    {/each}
  </nav>
</main>
