<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	import { BicepsFlexedIcon, HeartIcon, GithubIcon } from '$lib';
	import { base } from '$app/paths';
	
	let totalIcons = $derived(() => getTotalIconCount());
	let mobileMenuOpen = $state(false);
	let starCount = $state(0);
	let logoIconRef: any;
	let githubIconRef: any;
	let heartIconRef: any;
	
	// GitHub API'den gerçek yıldız sayısını al
	async function fetchStarCount() {
		try {
			const response = await fetch('https://api.github.com/repos/serhat-yildiz/svelte-animate-icons');
			const data = await response.json();
			starCount = data.stargazers_count || 0;
			console.log('GitHub stars:', starCount); // Debug için
		} catch (error) {
			console.log('Star count fetch failed:', error);
			// Geçici olarak test değeri atalım
			starCount = 1;
		}
	}
	
	// Component mount olduğunda yıldız sayısını al
	$effect(() => {
		fetchStarCount();
	});
	
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
		<a 
			href="{base}/" 
			class="logo"
			onmouseenter={() => logoIconRef?.start()}
			onmouseleave={() => logoIconRef?.stop()}
		>
				<div class="logo-icon">
					<BicepsFlexedIcon bind:this={logoIconRef} size={32} triggers={{ custom: true }} />
				</div>
				<div class="logo-text">
					<h1>AnimateIcons</h1>
					<span class="logo-badge">Svelte 5</span>
				</div>
			</a>
			
			<!-- Desktop Navigation -->
			<nav class="nav hide-mobile">
				<a href="{base}/docs" class="nav-link">
					Docs
				</a>
				<a href="{base}/#gallery" class="nav-link">
					Gallery
				</a>
				<a href="{base}/#install" class="nav-link">
					Install
				</a>
			</nav>
			
			<!-- Action Buttons -->
			<div class="actions">
				<a 
					href="https://github.com/serhat-yildiz/svelte-animate-icons" 
					target="_blank" 
					rel="noopener noreferrer"
					class="github-link btn-secondary"
					onmouseenter={() => {
						githubIconRef?.start();
						heartIconRef?.start();
					}}
					onmouseleave={() => {
						githubIconRef?.stop();
						heartIconRef?.stop();
					}}
				>
					<GithubIcon bind:this={githubIconRef} size={20} triggers={{ custom: true }} />
					<span class="hide-mobile">GitHub</span>
					<div class="star-count">
						<HeartIcon bind:this={heartIconRef} size={14} triggers={{ custom: true }} />
						<span>{starCount}</span>
					</div>
				</a>
				
				<!-- Mobile Menu Button -->
				<button class="mobile-menu-btn show-mobile" aria-label="Toggle mobile menu" onclick={toggleMobileMenu}>
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
						Docs
					</button>
					<button class="mobile-nav-link" onclick={() => scrollToSection('gallery')}>
						Gallery
					</button>
					<button class="mobile-nav-link" onclick={() => scrollToSection('install')}>
						Install
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
		gap: 4px;
		margin-left: var(--space-sm);
		padding: 2px 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-primary);
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
