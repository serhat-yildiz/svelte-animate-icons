<script lang="ts">
	import { getAvailableIcons, getTotalIconCount } from '$lib/registry/iconRegistry.js';
	
	const totalIcons = getTotalIconCount();
	const allIcons = getAvailableIcons();
	
	// Get a few sample icons for examples
	const sampleIcons = allIcons.slice(0, 3);
</script>

<svelte:head>
	<title>Docs - Svelte Animate Icons</title>
	<meta name="description" content="Documentation for Svelte Animate Icons - Beautiful animated SVG icons for Svelte 5 applications" />
</svelte:head>

<div class="docs-page">
	<div class="container">
		<!-- Header -->
		<div class="docs-header">
			<h1>Documentation</h1>
			<p class="lead">
				Learn how to use Svelte Animate Icons in your projects. 
				Get started with installation, explore component API, and see examples.
			</p>
		</div>

		<!-- Navigation -->
		<nav class="docs-nav">
			<a href="#installation" class="nav-link">Installation</a>
			<a href="#basic-usage" class="nav-link">Basic Usage</a>
			<a href="#component-api" class="nav-link">Component API</a>
			<a href="#examples" class="nav-link">Examples</a>
			<a href="#customization" class="nav-link">Customization</a>
			<a href="#typescript" class="nav-link">TypeScript</a>
		</nav>

		<!-- Content -->
		<div class="docs-content">
			<!-- Installation -->
			<section id="installation" class="docs-section">
				<h2>Installation</h2>
				<p>Install Svelte Animate Icons using your preferred package manager:</p>
				
				<div class="code-tabs">
					<div class="tab-header">
						<button class="tab-btn active">npm</button>
						<button class="tab-btn">pnpm</button>
						<button class="tab-btn">bun</button>
					</div>
					<div class="code-block">
						<code>npm install svelte-animate-icons</code>
					</div>
				</div>
			</section>

			<!-- Basic Usage -->
			<section id="basic-usage" class="docs-section">
				<h2>Basic Usage</h2>
				<p>Import and use icons in your Svelte components:</p>
				
				<div class="code-block">
					<pre><code>{`<script>
  import { HeartIcon, BellIcon, SearchIcon } from 'svelte-animate-icons';
</script>

<HeartIcon size={24} />
<BellIcon size={32} class="text-blue-500" />
<SearchIcon size={20} />`}</code></pre>
				</div>

				<div class="example-preview">
					<h3>Live Preview</h3>
					<div class="icon-examples">
						{#each sampleIcons as icon}
							<div class="icon-example">
								<svelte:component this={icon.component} size={32} />
								<span>{icon.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</section>

			<!-- Component API -->
			<section id="component-api" class="docs-section">
				<h2>Component API</h2>
				<p>All icon components accept the following props:</p>
				
				<div class="api-table">
					<table>
						<thead>
							<tr>
								<th>Prop</th>
								<th>Type</th>
								<th>Default</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>size</code></td>
								<td><code>number</code></td>
								<td><code>28</code></td>
								<td>Icon size in pixels</td>
							</tr>
							<tr>
								<td><code>class</code></td>
								<td><code>string</code></td>
								<td><code>""</code></td>
								<td>CSS classes to apply</td>
							</tr>
							<tr>
								<td><code>...restProps</code></td>
								<td><code>any</code></td>
								<td>-</td>
								<td>Any additional HTML attributes</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>

			<!-- Examples -->
			<section id="examples" class="docs-section">
				<h2>Examples</h2>
				
				<div class="example-group">
					<h3>Size Variations</h3>
					<div class="code-block">
						<pre><code>{`<HeartIcon size={16} />  <!-- Small -->
<HeartIcon size={24} />  <!-- Medium -->
<HeartIcon size={32} />  <!-- Large -->
<HeartIcon size={48} />  <!-- Extra Large -->`}</code></pre>
					</div>
				</div>

				<div class="example-group">
					<h3>With CSS Classes</h3>
					<div class="code-block">
						<pre><code>{`<BellIcon class="text-red-500 hover:text-red-700" />
<SearchIcon class="opacity-75 transition-opacity" />
<HeartIcon class="animate-pulse text-pink-500" />`}</code></pre>
					</div>
				</div>

				<div class="example-group">
					<h3>Event Handlers</h3>
					<div class="code-block">
						<pre><code>{`<script>
  function handleClick() {
    console.log('Icon clicked!');
  }
</script>

<BellIcon onclick={handleClick} />
<HeartIcon on:mouseenter={() => console.log('Hovered!')} />`}</code></pre>
					</div>
				</div>
			</section>

			<!-- Customization -->
			<section id="customization" class="docs-section">
				<h2>Customization</h2>
				<p>Icons inherit color from their parent element and can be styled with CSS:</p>
				
				<div class="code-block">
					<pre><code>{`.my-icon {
  color: #3b82f6;
  transition: color 0.2s ease;
}

.my-icon:hover {
  color: #1d4ed8;
  transform: scale(1.1);
}`}</code></pre>
				</div>
			</section>

			<!-- TypeScript -->
			<section id="typescript" class="docs-section">
				<h2>TypeScript Support</h2>
				<p>Svelte Animate Icons is built with TypeScript and provides full type definitions:</p>
				
				<div class="code-block">
					<pre><code>{`import type { ComponentType } from 'svelte';
import { HeartIcon } from 'svelte-animate-icons';

interface IconProps {
  size?: number;
  class?: string;
  [key: string]: any;
}

const MyIcon: ComponentType<IconProps> = HeartIcon;`}</code></pre>
				</div>
			</section>

			<!-- Footer -->
			<div class="docs-footer">
				<p>
					Found an issue or want to contribute? 
					<a href="https://github.com/serhat-yildiz/svelte-animate-icons" target="_blank" rel="noopener">
						Visit our GitHub repository
					</a>
				</p>
				<p class="stats">
					📚 {totalIcons} animated icons available
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.docs-page {
		min-height: 100vh;
		background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
		padding: var(--space-3xl) 0;
	}

	.docs-header {
		text-align: center;
		margin-bottom: var(--space-3xl);
	}

	.docs-header h1 {
		font-size: clamp(2.5rem, 5vw, 3rem);
		font-weight: 800;
		margin: 0 0 var(--space-lg);
		background: linear-gradient(135deg, var(--svelte-primary), var(--svelte-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.lead {
		font-size: 1.125rem;
		color: var(--text-secondary);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
	}

	.docs-nav {
		display: flex;
		gap: var(--space-lg);
		justify-content: center;
		margin-bottom: var(--space-3xl);
		flex-wrap: wrap;
	}

	.nav-link {
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		color: var(--text-secondary);
		text-decoration: none;
		font-weight: 500;
		transition: all var(--transition-normal);
		backdrop-filter: blur(12px);
	}

	.nav-link:hover {
		background: rgba(255, 62, 0, 0.1);
		border-color: rgba(255, 62, 0, 0.3);
		color: var(--svelte-primary);
	}

	.docs-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.docs-section {
		margin-bottom: var(--space-3xl);
		padding: var(--space-2xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(12px);
	}

	.docs-section h2 {
		font-size: 1.875rem;
		font-weight: 700;
		margin: 0 0 var(--space-lg);
		color: var(--text-primary);
	}

	.docs-section h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: var(--space-xl) 0 var(--space-md);
		color: var(--text-primary);
	}

	.docs-section p {
		color: var(--text-secondary);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}

	.code-tabs {
		margin: var(--space-lg) 0;
	}

	.tab-header {
		display: flex;
		gap: 4px;
		margin-bottom: 0;
	}

	.tab-btn {
		padding: var(--space-sm) var(--space-lg);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--glass-border);
		border-bottom: none;
		border-radius: var(--radius-md) var(--radius-md) 0 0;
		color: var(--text-secondary);
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-normal);
	}

	.tab-btn.active {
		background: rgba(0, 0, 0, 0.2);
		color: var(--text-primary);
		border-color: var(--glass-border);
	}

	.code-block {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		overflow-x: auto;
		font-family: 'Monaco', 'Menlo', monospace;
		margin: var(--space-lg) 0;
	}

	.code-block code {
		color: var(--text-primary);
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.code-block pre {
		margin: 0;
		white-space: pre-wrap;
	}

	.example-preview {
		margin: var(--space-xl) 0;
		padding: var(--space-lg);
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
	}

	.icon-examples {
		display: flex;
		gap: var(--space-xl);
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}

	.icon-example {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}

	.icon-example span {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		font-family: monospace;
	}

	.api-table {
		overflow-x: auto;
		margin: var(--space-lg) 0;
	}

	.api-table table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.api-table th,
	.api-table td {
		padding: var(--space-md);
		text-align: left;
		border-bottom: 1px solid var(--glass-border);
	}

	.api-table th {
		background: rgba(255, 255, 255, 0.05);
		font-weight: 600;
		color: var(--text-primary);
	}

	.api-table td {
		color: var(--text-secondary);
	}

	.api-table code {
		background: rgba(255, 255, 255, 0.1);
		padding: 0.2em 0.4em;
		border-radius: 4px;
		font-family: monospace;
		color: var(--svelte-primary);
	}

	.example-group {
		margin: var(--space-xl) 0;
	}

	.docs-footer {
		text-align: center;
		margin-top: var(--space-3xl);
		padding: var(--space-xl);
		border-top: 1px solid var(--glass-border);
	}

	.docs-footer p {
		margin: var(--space-sm) 0;
		color: var(--text-tertiary);
	}

	.docs-footer a {
		color: var(--svelte-primary);
		text-decoration: none;
		transition: color var(--transition-normal);
	}

	.docs-footer a:hover {
		color: var(--svelte-secondary);
	}

	.stats {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--svelte-primary);
	}

	@media (max-width: 768px) {
		.docs-nav {
			gap: var(--space-sm);
		}

		.nav-link {
			padding: var(--space-xs) var(--space-md);
			font-size: 0.875rem;
		}

		.docs-section {
			padding: var(--space-lg);
		}

		.icon-examples {
			gap: var(--space-lg);
		}

		.api-table {
			font-size: 0.75rem;
		}

		.api-table th,
		.api-table td {
			padding: var(--space-sm);
		}
	}
</style>
