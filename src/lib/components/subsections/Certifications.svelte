<script lang="ts">
	import CredlyBadge from '$lib/components/badges/CredlyBadge.svelte';
	import UnearnedBadge from '$lib/components/badges/UnearnedBadge.svelte';

	import awsCcp from '$lib/assets/aws/ccp.png';
	import awsSaa from '$lib/assets/aws/saa.png';
	import awsDev from '$lib/assets/aws/dev.png';
</script>

<div class="flex min-h-[100px] flex-wrap gap-3 overflow-visible sm:min-h-[140px] sm:gap-5">
	<CredlyBadge
		badgeId="e935380f-b50a-40d6-a0c2-ef7b1642658f"
		imageSrc={awsCcp}
		alt="AWS Cloud Practitioner"
	/>
	<UnearnedBadge imageSrc={awsSaa} alt="AWS Solutions Architect" tooltip={true} />
	<UnearnedBadge imageSrc={awsDev} alt="AWS Developer" tooltip={false} />
</div>
