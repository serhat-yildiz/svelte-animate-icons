<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getAvailableIcons, getTotalIconCount } from '$lib/registry/iconRegistry.js';
	import { HeartIcon, BellIcon, BoltIcon, ActivityIcon, BlocksIcon, CodeIcon } from '$lib';
	import { base } from '$app/paths';
	
	const totalIcons = getTotalIconCount();
	const allIcons = getAvailableIcons();
	
	// Get a few sample icons for examples
	const sampleIcons = allIcons.slice(0, 3);
</script>

<svelte:head>
	<title>Documentation - Svelte Animate Icons | Quick Start Guide</title>
	<meta name="description" content="Complete documentation and quick start guide for Svelte Animate Icons. Learn how to install, import, and use 130+ animated SVG icons in your Svelte 5 projects." />
	<meta name="keywords" content="svelte animate icons documentation, svelte 5 icons tutorial, animated svg icons guide, web animations api svelte" />
	
	<!-- Open Graph -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://serhat-yildiz.github.io/svelte-animate-icons/docs" />
	<meta property="og:title" content="Documentation - Svelte Animate Icons" />
	<meta property="og:description" content="Complete documentation and quick start guide for Svelte Animate Icons. Learn how to use 130+ animated SVG icons in Svelte 5." />
	<meta property="og:image" content="https://serhat-yildiz.github.io/svelte-animate-icons/og-docs.png" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:title" content="Documentation - Svelte Animate Icons" />
	<meta property="twitter:description" content="Complete documentation and quick start guide for Svelte Animate Icons. Learn how to use 130+ animated SVG icons in Svelte 5." />
	
	<!-- Canonical -->
	<link rel="canonical" href="https://serhat-yildiz.github.io/svelte-animate-icons/docs" />
</svelte:head>

<Header />

<main class="docs-page">
	<div class="container">
		<!-- Hero Section -->
		<div class="docs-hero">
			<h1>Documentation</h1>
			<p class="lead">Simple. Fast. Beautiful animated icons for Svelte 5.</p>
			<div class="hero-badges">
				<span class="badge">{totalIcons} Icons</span>
				<span class="badge">Svelte 5</span>
				<span class="badge">TypeScript</span>
			</div>
		</div>

		<!-- Quick Install -->
		<section class="install-section">
			<h2>1. Install</h2>
			<div class="code-block">
				<code>npm install svelte-animate-icons</code>
			</div>
		</section>

		<!-- Quick Usage -->
		<section class="usage-section">
			<h2>2. Use</h2>
			<div class="code-block">
				<pre><code>{`<script>
  import { HeartIcon, BellIcon } from '$lib';
</script>

<HeartIcon size={24} />
<BellIcon size={32} class="text-red-500" />`}</code></pre>
			</div>
			
			<div class="live-demo">
				<h3>Live Demo</h3>
				<div class="icon-showcase">
					<div class="demo-icon">
						<HeartIcon size={48} />
					</div>
					<div class="demo-icon">
						<BellIcon size={48} />
					</div>
					{#each sampleIcons.slice(2, 4) as icon}
						{@const IconComponent = icon.component}
						<div class="demo-icon">
							<IconComponent size={48} />
						</div>
					{/each}
				</div>
				<p class="demo-note">Hover to see animations</p>
			</div>
		</section>

		<!-- Quick Reference -->
		<section class="reference-section">
			<h2>3. Customize</h2>
			<div class="quick-props">
				<div class="prop-item">
					<code>size={24}</code>
					<span>Icon size in pixels</span>
				</div>
				<div class="prop-item">
					<code>class="my-style"</code>
					<span>CSS classes for styling</span>
				</div>
				<div class="prop-item">
					<code>onclick={() => {}}</code>
					<span>Event handlers</span>
				</div>
			</div>
		</section>

		<!-- Features -->
		<section class="features-section">
			<div class="feature-grid">
				<div class="feature">
					<div class="feature-icon">
						<BoltIcon size={32} />
					</div>
					<h3>Lightning Fast</h3>
					<p>Web Animations API for 60fps performance</p>
				</div>
				<div class="feature">
					<div class="feature-icon">
						<ActivityIcon size={32} />
					</div>
					<h3>Svelte 5 Ready</h3>
					<p>Built with modern runes and reactivity</p>
				</div>
				<div class="feature">
					<div class="feature-icon">
						<BlocksIcon size={32} />
					</div>
					<h3>Tiny Bundle</h3>
					<p>Tree-shakeable, import only what you need</p>
				</div>
				<div class="feature">
					<div class="feature-icon">
						<CodeIcon size={32} />
					</div>
					<h3>Easy Styling</h3>
					<p>CSS-friendly, no complex configurations</p>
				</div>
			</div>
		</section>

		<!-- Browse Icons -->
		<section class="browse-section">
			<h2>Browse {totalIcons} Icons</h2>
			<div class="browse-actions">
				<a href="{base}/#gallery" class="btn-primary">View All Icons</a>
				<a href="https://github.com/serhat-yildiz/svelte-animate-icons" target="_blank" class="btn-secondary">
					GitHub
				</a>
			</div>
		</section>
	</div>
</main>

<Footer />

<style>
	.docs-page {
		min-height: calc(100vh - 120px);
		background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
		padding: var(--space-3xl) 0;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-xl);
	}

	.docs-hero {
		text-align: center;
		margin-bottom: var(--space-3xl);
		padding: var(--space-3xl) 0;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-2xl);
		backdrop-filter: blur(12px);
		position: relative;
		overflow: hidden;
	}

	.docs-hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--svelte-primary), transparent);
		opacity: 0.8;
	}

	.docs-hero h1 {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		margin: 0 0 var(--space-lg);
		background: linear-gradient(135deg, var(--svelte-primary), #ff8a00);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-badges {
		display: flex;
		justify-content: center;
		gap: var(--space-md);
		margin-top: var(--space-xl);
		flex-wrap: wrap;
	}

	.badge {
		background: rgba(255, 62, 0, 0.1);
		color: var(--svelte-primary);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-full);
		font-size: 0.875rem;
		font-weight: 600;
		border: 1px solid rgba(255, 62, 0, 0.2);
	}

	.lead {
		font-size: 1.25rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
	}

	/* Sections */
	section {
		margin-bottom: var(--space-2xl);
		padding: var(--space-2xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-2xl);
		backdrop-filter: blur(12px);
		position: relative;
		transition: all var(--transition-normal);
	}

	section:hover {
		border-color: rgba(255, 62, 0, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	section h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 var(--space-lg);
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	section h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: var(--space-lg) 0 var(--space-md);
		color: var(--text-primary);
	}

	/* Code blocks */
	.code-block {
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		overflow-x: auto;
		font-family: 'Monaco', 'Menlo', monospace;
	}

	.code-block code {
		color: var(--text-primary);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.code-block pre {
		margin: 0;
	}

	/* Live demo */
	.live-demo {
		margin-top: var(--space-xl);
		text-align: center;
	}

	.icon-showcase {
		display: flex;
		gap: var(--space-lg);
		justify-content: center;
		margin: var(--space-lg) 0;
		padding: var(--space-lg);
		background: rgba(255, 255, 255, 0.02);
		border-radius: var(--radius-lg);
		border: 1px solid var(--glass-border);
	}

	.demo-icon {
		padding: var(--space-md);
		border-radius: var(--radius-md);
		transition: transform var(--transition-normal);
	}

	.demo-icon:hover {
		transform: scale(1.1);
	}

	.demo-note {
		font-size: 0.875rem;
		color: var(--text-tertiary);
		font-style: italic;
		margin: 0;
	}

	/* Quick props */
	.quick-props {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.prop-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md);
		background: rgba(255, 255, 255, 0.02);
		border-radius: var(--radius-md);
		border: 1px solid var(--glass-border);
	}

	.prop-item code {
		background: rgba(255, 62, 0, 0.1);
		color: var(--svelte-primary);
		padding: 0.3em 0.6em;
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-weight: 600;
		flex-shrink: 0;
	}

	.prop-item span {
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	/* Features */
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: var(--space-lg);
		margin-top: var(--space-lg);
	}

	.feature {
		text-align: center;
		padding: var(--space-lg);
		background: rgba(255, 255, 255, 0.02);
		border-radius: var(--radius-lg);
		border: 1px solid var(--glass-border);
	}

	.feature-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-md);
		color: var(--svelte-primary);
	}

	.feature h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 var(--space-sm);
		color: var(--text-primary);
	}

	.feature p {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.4;
	}

	/* Browse section */
	.browse-section {
		text-align: center;
	}

	.browse-actions {
		display: flex;
		gap: var(--space-md);
		justify-content: center;
		margin-top: var(--space-lg);
	}

	.btn-primary, .btn-secondary {
		padding: var(--space-md) var(--space-xl);
		border-radius: var(--radius-lg);
		text-decoration: none;
		font-weight: 600;
		transition: all var(--transition-normal);
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.btn-primary {
		background: var(--svelte-primary);
		color: white;
		border: 1px solid var(--svelte-primary);
	}

	.btn-primary:hover {
		background: var(--svelte-secondary);
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(255, 62, 0, 0.3);
	}

	.btn-secondary {
		background: transparent;
		color: var(--text-secondary);
		border: 1px solid var(--glass-border);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
		border-color: rgba(255, 62, 0, 0.3);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.container {
			padding: 0 var(--space-md);
		}

		section {
			padding: var(--space-lg);
		}

		.icon-showcase {
			flex-wrap: wrap;
			gap: var(--space-md);
		}

		.feature-grid {
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
			gap: var(--space-md);
		}

		.browse-actions {
			flex-direction: column;
			align-items: center;
		}

		.quick-props {
			gap: var(--space-sm);
		}

		.prop-item {
			flex-direction: column;
			text-align: center;
			gap: var(--space-sm);
		}
	}
</style>
