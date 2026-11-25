<script lang="ts">
	export let url: string;
	export let text: string;
	export let color: string;
	export let hcolor: string;
	export let iconClass: string;
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="flex-1 bg-{color} hover:bg-{hcolor} short:text-base text-ltext transform px-4 py-3 text-center text-base font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:text-xl"
>
	<span class="flex items-center justify-center gap-2">
		<i class={iconClass}></i>
		{text}
	</span>
</a>
