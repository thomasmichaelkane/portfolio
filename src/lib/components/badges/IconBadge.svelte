<script lang="ts">
	export let name: string;
	export let url: string;
	export let hcolor: string;
</script>

<div
	class="m-3 inline-block hover:scale-120 sm:m-5 hover:text-{hcolor} transition-all duration-150 ease-in-out"
>
	<a href={url} target="_blank" rel="noopener noreferrer" aria-label={name}>
		<i class="fab text-3xl md:text-4xl fa-{name}"></i>
	</a>
</div>
