<!-- Head -->
<svelte:head>
	<title>404 - Page Not Found</title>
	<meta name="description" content="The page you're looking for doesn't exist." />
</svelte:head>

<!-- 404 -->
<div class="bg-lbackground text-ctext h-screen flex-1 overflow-y-auto px-4 py-6">
	<div class="pt-40 text-center">
		<h1 class="mb-6 text-6xl font-bold md:text-8xl">404</h1>
		<p class="mb-8 text-4xl md:text-6xl">Looks like you got lost!</p>

		<div class="relative mt-4 inline-block">
			<a
				href="/"
				class="bg-primary text-ltext cursor-pointer rounded-lg px-8 py-4 text-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-80 hover:shadow-xl"
			>
				Return to home
			</a>
		</div>
	</div>
</div>
