<script lang="ts">
  export let name: string;
  export let url: string;
  export let hcolor: string;
</script>

<div class="inline-block m-3 sm:m-5 hover:scale-120 hover:text-{hcolor} transition-all duration-150 ease-in-out">
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={name}
  >
    <i class="text-3xl md:text-4xl fab fa-{name}"></i>
  </a>
</div>