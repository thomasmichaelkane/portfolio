<script lang="ts">
  interface Props {
    name: string;
    logoSrc: string;
    playStoreUrl: string;
    privacyPolicyUrl: string;
  }

  let { name, logoSrc, playStoreUrl, privacyPolicyUrl }: Props = $props();
</script>

<!--
  Only the logo shows by default; the name and privacy link fade in on hover
  or keyboard focus. Touch screens can't hover, so they always show them.
-->
<div class="group flex w-32 flex-col items-center md:w-40">
  <a
    href={playStoreUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="{name} on Google Play"
    class="block rounded-2xl transition-transform duration-200 group-hover:scale-105"
  >
    <img src={logoSrc} alt="" class="h-32 w-32 rounded-2xl shadow-md md:h-40 md:w-40" />
  </a>

  <div
    class="mt-4 flex flex-col items-center gap-1 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
  >
    <p class="text-2xl md:text-3xl">{name}</p>
    <a href={privacyPolicyUrl} class="font-mono text-sm hover:underline">privacy policy</a>
  </div>
</div>
