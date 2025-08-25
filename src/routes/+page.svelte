<script lang="ts">
	import Header from '../lib/components/Header.svelte';
	import Hero from '../lib/components/Hero.svelte';
	import IconGallery from '../lib/components/IconGallery.svelte';
	import InstallSection from '../lib/components/InstallSection.svelte';
	import Footer from '../lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Svelte Animate Icons - 130+ Beautiful Animated Icons for Svelte 5</title>
	<meta name="description" content="130+ beautiful, performant animated SVG icons for Svelte 5. Lightning-fast Web Animations API, tree-shakeable, TypeScript support. Free and open source." />
	<meta name="keywords" content="svelte 5, animated icons, svg icons, web animations api, typescript, runes, ui components, react icons alternative" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://serhat-yildiz.github.io/svelte-animate-icons/" />
	<meta property="og:title" content="Svelte Animate Icons - 130+ Beautiful Animated Icons for Svelte 5" />
	<meta property="og:description" content="130+ beautiful, performant animated SVG icons for Svelte 5. Lightning-fast Web Animations API, tree-shakeable, TypeScript support." />
	<meta property="og:image" content="https://serhat-yildiz.github.io/svelte-animate-icons/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Svelte Animate Icons" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://serhat-yildiz.github.io/svelte-animate-icons/" />
	<meta property="twitter:title" content="Svelte Animate Icons - 130+ Beautiful Animated Icons for Svelte 5" />
	<meta property="twitter:description" content="130+ beautiful, performant animated SVG icons for Svelte 5. Lightning-fast Web Animations API, tree-shakeable, TypeScript support." />
	<meta property="twitter:image" content="https://serhat-yildiz.github.io/svelte-animate-icons/og-image.png" />
	<meta property="twitter:creator" content="@serhatyildiz" />
	
	<!-- Additional SEO -->
	<meta name="theme-color" content="#ff3e00" />
	<link rel="alternate" type="application/rss+xml" title="Svelte Animate Icons Updates" href="/rss.xml" />
	
	<!-- Structured Data -->
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "Svelte Animate Icons",
		"description": "130+ beautiful, performant animated SVG icons for Svelte 5. Lightning-fast Web Animations API, tree-shakeable, TypeScript support.",
		"url": "https://serhat-yildiz.github.io/svelte-animate-icons/",
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "Web Browser",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		},
		"author": {
			"@type": "Person",
			"name": "Serhat YILDIZ",
			"url": "https://github.com/serhat-yildiz"
		},
		"programmingLanguage": "TypeScript",
		"runtimePlatform": "Svelte 5",
		"downloadUrl": "https://www.npmjs.com/package/svelte-animate-icons",
		"codeRepository": "https://github.com/serhat-yildiz/svelte-animate-icons"
	}
	</script>
	
	<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "SoftwareLibrary",
		"name": "svelte-animate-icons",
		"description": "Beautiful animated SVG icons for Svelte 5 with Web Animations API",
		"version": "1.0.0",
		"programmingLanguage": "TypeScript",
		"runtimePlatform": "Svelte 5",
		"codeRepository": "https://github.com/serhat-yildiz/svelte-animate-icons",
		"license": "https://opensource.org/licenses/MIT",
		"downloadUrl": "https://www.npmjs.com/package/svelte-animate-icons",
		"author": {
			"@type": "Person",
			"name": "Serhat YILDIZ"
		}
	}
	</script>
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