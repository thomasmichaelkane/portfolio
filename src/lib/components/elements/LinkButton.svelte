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
  class="flex-1 bg-{color} hover:bg-{hcolor} text-xl text-ltext text-center py-3 px-4 transition-all duration-200 font-medium hover:shadow-md transform hover:-translate-y-0.5"
>
  <span class="flex items-center justify-center gap-2">
    <i class="{iconClass}"></i>
    {text}
  </span>
</a>