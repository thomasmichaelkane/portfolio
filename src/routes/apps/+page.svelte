<svelte:head>
  <title>apps - tomkane</title>
  <meta name="description" content="Apps by Tom Kane" />
</svelte:head>

<div class="h-screen bg-lbackground px-4 py-6 font-serif text-dtext">
  <div class="pt-40 text-center">
    <h1 class="mb-16 text-6xl font-bold md:text-8xl">Apps</h1>
    <div class="flex flex-wrap justify-center gap-24">
      <div class="flex flex-col items-center gap-6">
        <img src="/apps/hestia-logo.svg" alt="Hestia logo" class="h-32 w-32 rounded-2xl" />
        <p class="text-4xl md:text-5xl">Hestia</p>
      </div>
      <div class="flex flex-col items-center gap-6">
        <div
          class="flex h-32 w-32 items-center justify-center rounded-2xl bg-dtext text-6xl text-ltext"
          role="img"
          aria-label="Deadwax logo"
        >
          <i class="fa-solid fa-music"></i>
        </div>
        <p class="text-4xl md:text-5xl">Deadwax</p>
      </div>
    </div>
  </div>
</div>
