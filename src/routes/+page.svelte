<script lang="ts">
	import Header from '../lib/components/Header.svelte';
	import Hero from '../lib/components/Hero.svelte';
	import IconGallery from '../lib/components/IconGallery.svelte';
	import InstallSection from '../lib/components/InstallSection.svelte';
	import Footer from '../lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Svelte Animate Icons - Beautiful animated icons for Svelte 5</title>
	<meta name="description" content="A collection of beautiful, performant animated SVG icons for Svelte 5. Transform static designs into engaging user experiences." />
	<meta property="og:title" content="Svelte Animate Icons" />
	<meta property="og:description" content="Beautiful animated icons for Svelte 5" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="page">
	<Header />
	<main>
		<Hero />
		<InstallSection />
		<IconGallery />
	</main>
	<Footer />
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	main {
		flex: 1;
	}
</style>