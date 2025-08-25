<script lang="ts">
	import { getAvailableIcons } from '../registry/iconRegistry.js';
  import { BicepsFlexedIcon, BlocksIcon, BoltIcon, CircleChevronRightIcon, CopyIcon, CircleCheckBigIcon } from '$lib';
	
	type TabType = 'npm' | 'pnpm' | 'bun';
	
	let activeTab = $state<TabType>('npm');
	let copied = $state(false);
	let copyTimeout: number;
	
	// Get random icon for demo
	const availableIcons = getAvailableIcons();
	const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)];
	const iconName = randomIcon.name;
	
	const commands = {
		npm: `npm install svelte-animate-icons`,
		pnpm: `pnpm add svelte-animate-icons`,
		bun: `bun add svelte-animate-icons`
	};
	
	const usageExample = `import { ${iconName.split('-').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1)
	).join('')}Icon } from '$lib';

<${iconName.split('-').map(word => 
	word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Icon size={24} />`;
	
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<section id="install" class="install-section">
	<div class="container">
		<div class="section-header">
			<h2 class="section-title">
				<div class="title-icon">
					<BicepsFlexedIcon size={32} />
				</div>
				<span class="text-gradient">Quick Start</span>
			</h2>
			<p class="section-description">
				Get started with Svelte Animate Icons in seconds. 
				Choose your preferred package manager and start animating!
			</p>
		</div>
		
		<div class="install-content">
			<!-- Installation -->
			<div class="install-card glass">
				<h3 class="card-title">Installation</h3>
				
				<!-- Package Manager Tabs -->
				<div class="tabs">
					<div class="tab-list">
						<button 
							class="tab"
							class:active={activeTab === 'npm'}
							onclick={() => activeTab = 'npm'}
						>
							npm
						</button>
						<button 
							class="tab"
							class:active={activeTab === 'pnpm'}
							onclick={() => activeTab = 'pnpm'}
						>
							pnpm
						</button>
						<button 
							class="tab"
							class:active={activeTab === 'bun'}
							onclick={() => activeTab = 'bun'}
						>
							bun
						</button>
					</div>
					
					<div class="tab-content">
						<div class="command-box">
							<code>{commands[activeTab]}</code>
							<button 
								class="copy-btn"
								onclick={() => copyToClipboard(commands[activeTab])}
								aria-label="Copy command"
							>
								{#if copied}
									<CopyIcon size={16} />
								{:else}
									<CopyIcon size={16} />
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Usage Example -->
			<div class="usage-card glass">
				<h3 class="card-title">Usage</h3>
				<div class="code-example">
					<pre><code>{usageExample}</code></pre>
					<button 
						class="copy-btn"
						onclick={() => copyToClipboard(usageExample)}
						aria-label="Copy usage example"
					>
						{#if copied}
							<CopyIcon size={16} />
						{:else}
							<CopyIcon size={16} />
						{/if}
					</button>
				</div>
			</div>
		</div>
		
		<!-- Features Grid -->
		<div class="features-grid">
			<div class="feature-card glass">
				<div class="feature-icon">
					<BoltIcon size={24} />
				</div>
				<h4>Purposeful Motion</h4>
				<p>Smooth, meaningful animations that enhance user experience without distraction.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<CircleCheckBigIcon size={24} />
				</div>
				<h4>Lightweight & Fast</h4>
				<p>Built on Web Animations API for optimal performance and minimal bundle size.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<BlocksIcon size={24} />
				</div>
				<h4>130+ Icons</h4>
				<p>Comprehensive icon library covering all common use cases and design needs.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<CircleChevronRightIcon size={24} />
				</div>
				<h4>Svelte 5 Ready</h4>
				<p>Built specifically for Svelte 5 with runes and modern patterns.</p>
			</div>
		</div>
	</div>
</section>

<style>
	.install-section {
		padding: var(--space-3xl) 0;
		background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
	}
	
	.section-header {
		text-align: center;
		margin-bottom: var(--space-3xl);
	}
	
	.section-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		font-size: clamp(2rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 var(--space-lg);
		line-height: 1.2;
	}

	.title-icon {
		background: linear-gradient(135deg, var(--svelte-primary), #ff8a00);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		color: var(--svelte-primary);
		display: flex;
		align-items: center;
	}
	
	.section-description {
		font-size: clamp(1rem, 2vw, 1.125rem);
		color: var(--text-secondary);
		margin: 0 auto;
		max-width: 600px;
		line-height: 1.6;
	}
	
	.install-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xl);
		margin-bottom: var(--space-3xl);
	}
	
	.install-card,
	.usage-card {
		padding: var(--space-xl);
		border-radius: var(--radius-xl);
		position: relative;
	}
	
	.card-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 var(--space-lg);
		color: var(--text-primary);
	}
	
	.tabs {
		width: 100%;
	}
	
	.tab-list {
		display: flex;
		background: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-lg);
		padding: 4px;
		margin-bottom: var(--space-lg);
		border: 1px solid var(--glass-border);
	}
	
	.tab {
		flex: 1;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.875rem;
		transition: all var(--transition-normal);
		border: none;
		cursor: pointer;
	}
	
	.tab:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
	}
	
	.tab.active {
		background: var(--svelte-primary);
		color: white;
		box-shadow: 0 2px 8px rgba(255, 62, 0, 0.3);
	}
	
	.command-box {
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
		overflow-x: auto;
	}
	
	.command-box code {
		color: var(--svelte-primary);
		font-size: 0.875rem;
		font-weight: 500;
		background: none;
		padding: 0;
	}

	.code-example {
  		display: flex;
  		align-items: center; 
  		justify-content: space-between; 
	}
	
	.copy-btn {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.copy-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		color: var(--text-primary);
		border-color: var(--svelte-primary);
	}
	
	.code-example {
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}
	
	.code-example pre {
		margin: 0;
		padding: var(--space-lg);
		overflow-x: auto;
		background: none;
		border: none;
	}
	
	.code-example code {
		color: var(--text-primary);
		font-size: 0.875rem;
		line-height: 1.6;
		background: none;
		padding: 0;
	}
	
	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-lg);
	}
	
	.feature-card {
		padding: var(--space-xl);
		border-radius: var(--radius-xl);
		text-align: center;
		transition: all var(--transition-normal);
	}
	
	.feature-card:hover {
		transform: translateY(-4px);
		border-color: rgba(255, 62, 0, 0.3);
	}
	
	.feature-icon {
		color: var(--svelte-primary);
		margin-bottom: var(--space-md);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-normal);
	}
	
	.feature-card h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0 0 var(--space-sm);
		color: var(--text-primary);
	}
	
	.feature-card p {
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.5;
		font-size: 0.9rem;
	}
	
	@media (max-width: 768px) {
		.install-content {
			grid-template-columns: 1fr;
			gap: var(--space-lg);
		}
		
		.features-grid {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
		
		.install-card,
		.usage-card {
			padding: var(--space-lg);
		}
		
		.feature-card {
			padding: var(--space-lg);
		}
	}
	
	@media (max-width: 480px) {
		.tab-list {
			flex-direction: column;
			gap: 4px;
		}
		
		.command-box,
		.code-example pre {
			padding: var(--space-md);
		}
		
		.command-box code,
		.code-example code {
			font-size: 0.75rem;
		}
	}
</style>
