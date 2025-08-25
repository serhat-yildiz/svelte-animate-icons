<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	
	const currentYear = new Date().getFullYear();
	const totalIcons = $derived(() => getTotalIconCount());
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<!-- Main Section -->
			<div class="footer-section main">
				<div class="footer-brand">
					<div class="brand-logo">
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
						</svg>
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
					<li><a href="#install">Installation</a></li>
					<li><a href="#gallery">Icon Gallery</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons#usage" target="_blank">Usage Guide</a></li>
					<li><a href="https://github.com/serhat-yildiz/svelte-animate-icons#api" target="_blank">API Reference</a></li>
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
					<a href="https://www.linkedin.com/in/serhat-yldz/" target="_blank" rel="noopener" class="social-link">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
						</svg>
						<span>LinkedIn</span>
					</a>
					<a href="https://github.com/serhat-yildiz" target="_blank" rel="noopener" class="social-link">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						<span>GitHub</span>
					</a>
					<a href="https://x.com/themedess" target="_blank" rel="noopener" class="social-link">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
						</svg>
						<span>X (Twitter)</span>
					</a>
				</div>
			</div>
			
			<div class="tech-badge">
				<span>Powered by</span>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="#ff3e00">
					<path d="M20.042 9.146A8.8 8.8 0 0 0 12 2.5a8.8 8.8 0 0 0-8.042 6.646 6.5 6.5 0 0 0 .042 12.854h16a6.5 6.5 0 0 0 .042-12.854z"/>
				</svg>
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
