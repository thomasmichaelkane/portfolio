<script lang="ts">
  import TechBadge from "../badges/TechBadge.svelte";
  import pySvg from '$lib/assets/tech-icons/Python.svg';
  import fapiSvg from '$lib/assets/tech-icons/FastAPI.svg';
  import npSvg from '$lib/assets/tech-icons/NumPy.svg';
  import skSvg from '$lib/assets/tech-icons/scikit-learn.svg';
  import rsSvg from '$lib/assets/tech-icons/Rust.svg';
  import jsSvg from '$lib/assets/tech-icons/JavaScript.svg';
  import tsSvg from '$lib/assets/tech-icons/TypeScript.svg';
  import svSvg from '$lib/assets/tech-icons/Svelte.svg';
  import twSvg from '$lib/assets/tech-icons/TailwindCSS.svg';
  import dockSvg from '$lib/assets/tech-icons/Docker.svg';
  import pytSvg from '$lib/assets/tech-icons/PyTorch.svg';
  import rctSvg from '$lib/assets/tech-icons/React.svg';
  import gitSvg from '$lib/assets/tech-icons/Git.svg';
  import linuxSvg from '$lib/assets/tech-icons/Linux.svg';
  import mplSvg from '$lib/assets/tech-icons/Matplotlib.svg';
  import awsSvg from '$lib/assets/tech-icons/AWS.svg';
  import pdSvg from '$lib/assets/tech-icons/Pandas.svg';
  import ocvSvg from '$lib/assets/tech-icons/OpenCV.svg';
  

  interface Badge {
    imageSrc: string;
    name: string;
  }

  export let badges: Badge[] = [
    { imageSrc: pySvg, name: 'Python'},
    { imageSrc: rsSvg, name: 'Rust'},
    { imageSrc: jsSvg, name: 'JavaScript'},
    { imageSrc: tsSvg, name: 'TypeScript'},
    { imageSrc: fapiSvg, name: 'FastAPI'},
    { imageSrc: svSvg, name: 'Svelte'},
    { imageSrc: rctSvg, name: 'React'},
    { imageSrc: twSvg, name: 'TailwindCSS'},
    { imageSrc: npSvg, name: 'NumPy'},
    { imageSrc: pdSvg, name: 'Pandas'},
    { imageSrc: ocvSvg, name: 'OpenCV'},
    { imageSrc: mplSvg, name: 'Matplotlib'},
    { imageSrc: pytSvg, name: 'PyTorch'},
    { imageSrc: skSvg, name: 'scikit-learn'},
    { imageSrc: linuxSvg, name: 'Linux'},
    { imageSrc: gitSvg, name: 'Git'},
    { imageSrc: dockSvg, name: 'Docker'},
    { imageSrc: awsSvg, name: 'AWS'},

  ];
</script>

<div>
  {#each badges as badge}
    <TechBadge 
      imageSrc={badge.imageSrc}
      badgeName={badge.name}
    />
  {/each}
</div>




