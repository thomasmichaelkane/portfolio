<script>
  import IconBadge from "../badges/IconBadge.svelte";

  export let info;

  export let icons = [
    { name: "github", url: info.githubUrl, hcolor: "primary"},
    { name: "linkedin", url: info.linkedinUrl, hcolor: "secondary"},
    { name: "google-scholar", url: info.scholarUrl, hcolor: "tertiary"},
    { name: "orcid", url: info.orcidUrl, hcolor: "quaternary"},
  ];
</script>

<div>
  {#each icons as icon}
    <IconBadge 
      name={icon.name}
      url={icon.url}
      hcolor={icon.hcolor}
    />
  {/each}
</div>

