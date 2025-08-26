<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	import { BicepsFlexedIcon, GithubIcon, HeartIcon, LinkedinIcon, XIcon } from '$lib';
	import { base } from '$app/paths';
	const currentYear = new Date().getFullYear();
	const totalIcons = $derived(() => getTotalIconCount());
	
	let githubIconRef: any;
	let linkedinIconRef: any;
	let xIconRef: any;
	let heartIconRef: any;
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<!-- Main Section -->
			<div class="footer-section main">
				<div class="footer-brand">
					<div class="brand-logo">
						<BicepsFlexedIcon size={28} triggers={{ hover: true }} />
						<h3>AnimateIcons</h3>
					</div>
					<p>Beautiful, performant animated icons for modern Svelte applications. Transform static designs into engaging user experiences.</p>
				</div>
				
				<div class="footer-stats">
					<div class="stat">
						<span class="stat-number">{totalIcons()}</span>
						<span class="stat-label">Icons</span>
					</div>
					<div class="stat">
						<span class="stat-number">~3KB</span>
						<span class="stat-label">Per Icon</span>
					</div>
					<div class="stat">
						<span class="stat-number">60fps</span>
						<span class="stat-label">Performance</span>
					</div>
				</div>
			</div>
			
			<!-- Links Section -->
			<div class="footer-section">
				<h4>Quick Start</h4>
				<ul class="footer-links">
					<li><a href="{base}/#install">Installation</a></li>
					<li><a href="{base}/#gallery">Icon Gallery</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons#usage" target="_blank">Usage Guide</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Resources</h4>
				<ul class="footer-links">
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons" target="_blank">GitHub Repository</a></li>
					<li><a href="https://npmjs.com/package/svelte-animate-icons" target="_blank">npm Package</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons/blob/main/CHANGELOG.md" target="_blank">Changelog</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons/blob/main/CONTRIBUTING.md" target="_blank">Contributing</a></li>
				</ul>
			</div>
			
			<div class="footer-section">
				<h4>Community</h4>
				<ul class="footer-links">
					<li><a href="https://svelte.dev/discord" target="_blank">Svelte Discord</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons/issues" target="_blank">Report Issues</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons/discussions" target="_blank">Discussions</a></li>
					<li><a href="https://x.com/themedess" target="_blank">Follow Updates</a></li>
				</ul>
			</div>
		</div>
		
		<!-- Footer Bottom -->
		<div class="footer-bottom">
			<div class="footer-info">
				<p>&copy; {currentYear} Svelte Animate Icons. Built with 
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
					</svg>
					for the Svelte community.</p>
				<div class="developer-info">
					<span>Developed by</span>
					<a href="mailto:serhatgulcanyldz04@gmail.com" class="developer-link">
						<strong>Serhat YILDIZ</strong>
					</a>
				</div>
				<div class="social-links">
					<a 
						href="https://github.com/serhat-yildiz" 
						target="_blank" 
						rel="noopener" 
						class="social-link"
						onmouseenter={() => githubIconRef?.start()}
						onmouseleave={() => githubIconRef?.stop()}
					>
						<GithubIcon bind:this={githubIconRef} size={16} triggers={{ custom: true }} />
						<span>GitHub</span>
					</a>
					<a 
						href="https://www.linkedin.com/in/serhat-yldz/" 
						target="_blank" 
						rel="noopener" 
						class="social-link"
						onmouseenter={() => linkedinIconRef?.start()}
						onmouseleave={() => linkedinIconRef?.stop()}
					>
						<LinkedinIcon bind:this={linkedinIconRef} size={16} triggers={{ custom: true }} />
						<span>LinkedIn</span>
					</a>
					<a 
						href="https://x.com/themedess" 
						target="_blank" 
						rel="noopener" 
						class="social-link"
						onmouseenter={() => xIconRef?.start()}
						onmouseleave={() => xIconRef?.stop()}
					>
						<XIcon bind:this={xIconRef} size={16} triggers={{ custom: true }} />
						<span>Twitter</span>
					</a>
				</div>
			</div>
			
			<div 
				class="tech-badge"
				role="button"
				tabindex="0"
				onmouseenter={() => heartIconRef?.start()}
				onmouseleave={() => heartIconRef?.stop()}
			>
				<span>Powered by</span>
				<HeartIcon bind:this={heartIconRef} size={16} triggers={{ custom: true }} />
				<span>Svelte 5</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin-top: var(--space-3xl);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.05) 100%);
		border-top: 1px solid var(--glass-border);
		backdrop-filter: blur(12px);
	}
	
	.footer-content {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr 1fr;
		gap: var(--space-2xl);
		padding: var(--space-3xl) 0 var(--space-2xl);
	}
	
	.footer-section.main {
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}
	
	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	
	.brand-logo {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		color: var(--svelte-primary);
	}
	
	.brand-logo h3 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, var(--svelte-primary), var(--svelte-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.footer-brand p {
		color: var(--text-secondary);
		line-height: 1.6;
		margin: 0;
		max-width: 300px;
	}
	
	.footer-stats {
		display: flex;
		gap: var(--space-lg);
	}
	
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-md);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		min-width: 80px;
	}
	
	.stat-number {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--svelte-primary);
	}
	
	.stat-label {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		margin-top: 0.25rem;
	}
	
	.footer-section h4 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 var(--space-lg);
		color: var(--text-primary);
	}
	
	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.footer-links a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color var(--transition-normal);
		padding: 0.25rem 0;
	}
	
	.footer-links a:hover {
		color: var(--svelte-primary);
	}
	
	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-xl) 0;
		border-top: 1px solid var(--glass-border);
		gap: var(--space-xl);
	}
	
	.footer-info {
		flex: 1;
	}
	
	.footer-info p {
		margin: 0 0 var(--space-sm);
		color: var(--text-tertiary);
		font-size: 0.875rem;
	}
	
	.developer-info {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
		flex-wrap: wrap;
		font-size: 0.875rem;
		color: var(--text-tertiary);
	}
	
	.developer-link {
		color: var(--svelte-primary);
		text-decoration: none;
		transition: color var(--transition-normal);
	}
	
	.developer-link:hover {
		color: var(--svelte-secondary);
	}
	
	.social-links {
		display: flex;
		gap: var(--space-md);
		flex-wrap: wrap;
	}
	
	.social-link {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		color: var(--text-tertiary);
		text-decoration: none;
		font-size: 0.8rem;
		transition: color var(--transition-normal);
	}
	
	.social-link:hover {
		color: var(--svelte-primary);
	}
	
	.heart-icon {
		color: var(--svelte-primary);
		animation: pulse 2s ease-in-out infinite;
		flex-shrink: 0;
		margin: 0 2px;
	}

	.tech-badge {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-lg);
		background: rgba(255, 62, 0, 0.1);
		border: 1px solid rgba(255, 62, 0, 0.2);
		border-radius: var(--radius-2xl);
		font-size: 0.8rem;
		color: var(--text-secondary);
		backdrop-filter: blur(12px);
	}
	
	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
			padding: var(--space-2xl) 0 var(--space-xl);
		}
		
		.footer-stats {
			justify-content: center;
			flex-wrap: wrap;
		}
		
		.footer-bottom {
			flex-direction: column;
			gap: var(--space-lg);
			text-align: center;
		}
		
		.social-links {
			justify-content: center;
		}
	}
	
	@media (max-width: 480px) {
		.footer-stats {
			gap: var(--space-sm);
		}
		
		.stat {
			min-width: 70px;
			padding: var(--space-sm);
		}
		
		.stat-number {
			font-size: 1rem;
		}
		
		.developer-info {
			flex-direction: column;
			gap: 0.25rem;
			text-align: center;
		}
		
		.social-links {
			gap: var(--space-lg);
		}
		
		.social-link {
			font-size: 0.85rem;
		}
	}
</style>
