<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	import GithubIcon from '../icons/GithubIcon.svelte';
	
	let totalIcons = $derived(() => getTotalIconCount());
	let mobileMenuOpen = $state(false);
	
	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
	
	function scrollToSection(sectionId: string) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
		mobileMenuOpen = false;
	}
</script>

<header class="header">
	<div class="container">
		<div class="header-content">
			<!-- Logo -->
			<a href="/" class="logo">
				<div class="logo-icon">
					<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
					</svg>
				</div>
				<div class="logo-text">
					<h1>AnimateIcons</h1>
					<span class="logo-badge">Svelte 5</span>
				</div>
			</a>
			
			<!-- Desktop Navigation -->
			<nav class="nav hide-mobile">
				<a href="/docs" class="nav-link">
					Docs
				</a>
				<a href="/#gallery" class="nav-link">
					Gallery
				</a>
				<a href="/#install" class="nav-link">
					Install
				</a>
			</nav>
			
			<!-- Action Buttons -->
			<div class="actions">
				<div class="star-count glass">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="star-icon">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
					</svg>
					<span>{totalIcons()}</span>
				</div>
				
				<a 
					href="https://github.com/serhat-yildiz/svelte-animate-icons" 
					target="_blank" 
					rel="noopener noreferrer"
					class="github-link btn-secondary"
				>
					<GithubIcon size={20} />
					<span class="hide-mobile">GitHub</span>
				</a>
				
				<!-- Mobile Menu Button -->
				<button class="mobile-menu-btn show-mobile" onclick={toggleMobileMenu}>
					<div class="hamburger" class:open={mobileMenuOpen}>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</button>
			</div>
		</div>
		
		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="mobile-menu animate-fade-in">
				<nav class="mobile-nav">
					<button class="mobile-nav-link" onclick={() => scrollToSection('docs')}>
						📚 Docs
					</button>
					<button class="mobile-nav-link" onclick={() => scrollToSection('gallery')}>
						🎨 Gallery
					</button>
					<button class="mobile-nav-link" onclick={() => scrollToSection('install')}>
						📦 Install
					</button>
				</nav>
			</div>
		{/if}
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(10, 10, 10, 0.9);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--glass-border);
		transition: all var(--transition-normal);
	}
	
	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-lg) 0;
		gap: var(--space-xl);
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		text-decoration: none;
		color: var(--text-primary);
		transition: opacity var(--transition-normal);
	}
	
	.logo:hover {
		opacity: 0.8;
	}
	
	.logo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		background: linear-gradient(135deg, var(--svelte-primary), var(--svelte-secondary));
		border-radius: var(--radius-lg);
		color: white;
		animation: pulse 3s ease-in-out infinite;
	}
	
	.logo-text h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		background: linear-gradient(135deg, var(--svelte-primary), var(--svelte-secondary));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
	
	.logo-badge {
		font-size: 0.75rem;
		font-weight: 600;
		background: linear-gradient(135deg, var(--svelte-primary), var(--svelte-secondary));
		color: white;
		padding: 0.2em 0.6em;
		border-radius: 12px;
		margin-left: var(--space-sm);
	}
	
	.nav {
		display: flex;
		gap: var(--space-md);
	}
	
	.nav-link {
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-md);
		background: transparent;
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.9rem;
		transition: all var(--transition-normal);
		text-decoration: none;
		border: 1px solid transparent;
	}
	
	.nav-link:hover {
		background: var(--glass-bg);
		color: var(--text-primary);
		border-color: var(--glass-border);
	}
	
	.actions {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}
	
	.star-count {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.star-icon {
		color: var(--svelte-primary);
		margin-right: var(--space-xs);
		flex-shrink: 0;
		animation: pulse 2s ease-in-out infinite;
	}
	
	.github-link {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		text-decoration: none;
	}
	
	.mobile-menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: var(--radius-md);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		color: var(--text-primary);
		transition: all var(--transition-normal);
	}
	
	.mobile-menu-btn:hover {
		background: var(--glass-hover);
	}
	
	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: 18px;
		height: 14px;
	}
	
	.hamburger span {
		width: 100%;
		height: 2px;
		background: currentColor;
		border-radius: 1px;
		transition: all var(--transition-fast);
		transform-origin: center;
	}
	
	.hamburger.open span:nth-child(1) {
		transform: rotate(45deg) translate(5px, 5px);
	}
	
	.hamburger.open span:nth-child(2) {
		opacity: 0;
		transform: scale(0);
	}
	
	.hamburger.open span:nth-child(3) {
		transform: rotate(-45deg) translate(5px, -5px);
	}
	
	.mobile-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: rgba(10, 10, 10, 0.95);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--glass-border);
		padding: var(--space-lg) 0;
	}
	
	.mobile-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	
	.mobile-nav-link {
		display: flex;
		align-items: center;
		padding: var(--space-lg);
		color: var(--text-secondary);
		text-decoration: none;
		font-weight: 500;
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		transition: all var(--transition-normal);
		text-align: left;
		width: 100%;
		font-size: 1rem;
	}
	
	.mobile-nav-link:hover,
	.mobile-nav-link:focus {
		background: var(--glass-bg);
		color: var(--text-primary);
		transform: translateX(4px);
	}
	
	@media (max-width: 768px) {
		.header-content {
			padding: var(--space-md) 0;
		}
		
		.logo-text h1 {
			font-size: 1.25rem;
		}
		
		.actions {
			gap: var(--space-sm);
		}
	}
	
	@media (max-width: 480px) {
		.logo-icon {
			width: 40px;
			height: 40px;
		}
		
		.logo-text h1 {
			font-size: 1.125rem;
		}
		
		.logo-badge {
			font-size: 0.65rem;
		}
	}
</style>
