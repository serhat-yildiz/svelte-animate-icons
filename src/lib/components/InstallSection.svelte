<script lang="ts">
	import { getAvailableIcons } from '../registry/iconRegistry.js';
	
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
	).join('')}Icon } from 'svelte-animate-icons';

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
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="title-icon">
					<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
					<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
					<polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
					<line x1="12" y1="22.08" x2="12" y2="12"/>
				</svg>
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
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<polyline points="20,6 9,17 4,12"/>
									</svg>
								{:else}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
										<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
										<path d="m5,15-4,-4 4,-4"/>
									</svg>
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
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<polyline points="20,6 9,17 4,12"/>
							</svg>
						{:else}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
								<path d="m5,15-4,-4 4,-4"/>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
		
		<!-- Features Grid -->
		<div class="features-grid">
			<div class="feature-card glass">
				<div class="feature-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<circle cx="12" cy="12" r="6"/>
						<circle cx="12" cy="12" r="2"/>
					</svg>
				</div>
				<h4>Purposeful Motion</h4>
				<p>Smooth, meaningful animations that enhance user experience without distraction.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
					</svg>
				</div>
				<h4>Lightweight & Fast</h4>
				<p>Built on Web Animations API for optimal performance and minimal bundle size.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
				</div>
				<h4>130+ Icons</h4>
				<p>Comprehensive icon library covering all common use cases and design needs.</p>
			</div>
			
			<div class="feature-card glass">
				<div class="feature-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
					</svg>
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
		color: var(--svelte-primary);
		flex-shrink: 0;
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
