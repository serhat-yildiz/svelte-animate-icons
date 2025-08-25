<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	import HeartIcon from '../icons/HeartIcon.svelte';
	import BellRingIcon from '../icons/BellRingIcon.svelte';
	import LoaderCircleIcon from '../icons/LoaderCircleIcon.svelte';
	import ActivityIcon from '../icons/ActivityIcon.svelte';
	
	let totalIcons = $derived(() => getTotalIconCount());
	
	// Demo icons with refs for programmatic control
	let heartRef: any;
	let bellRef: any;
	let loaderRef: any;
	let activityRef: any;
	
	function startDemoAnimations() {
		heartRef?.startAnimation();
		bellRef?.startAnimation();
		loaderRef?.startAnimation();
		activityRef?.startAnimation();
	}
	
	function scrollToGallery() {
		const gallery = document.getElementById('gallery');
		if (gallery) {
			gallery.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section class="hero">
	<div class="container">
		<div class="hero-content">
			<!-- Badge -->
			<div class="hero-badge animate-fade-in">
				<span class="badge-text">Now with {totalIcons()}+ animated icons</span>
			</div>
			
			<!-- Main Heading -->
			<h1 class="hero-title animate-slide-up">
				Make Every<br>
				<span class="text-gradient">Icon Move</span><br>
				with AnimateIcons
			</h1>
			
			<!-- Description -->
			<p class="hero-description animate-slide-up">
				A sleek Svelte 5 library for animated SVG icons that move with purpose. 
				Transform static designs into engaging user experiences with smooth, 
				performant animations built on Web Animations API.
			</p>
			
			<!-- Tech Stack Badge -->
			<div class="tech-stack animate-slide-up">
				<span class="tech-label">built with</span>
				<div class="tech-icons">
					<div class="tech-item">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="#ff3e00">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						<span>svelte 5</span>
					</div>
					<span class="tech-separator">and</span>
					<div class="tech-item">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
						</svg>
						<span>web animations api</span>
					</div>
				</div>
			</div>
			
			<!-- Demo Icons -->
			<div class="demo-icons animate-slide-up">
				<div class="icon-showcase">
					<div class="demo-icon" onclick={startDemoAnimations}>
						<HeartIcon bind:this={heartRef} size={48} />
					</div>
					<div class="demo-icon" onclick={startDemoAnimations}>
						<BellRingIcon bind:this={bellRef} size={48} />
					</div>
					<div class="demo-icon" onclick={startDemoAnimations}>
						<LoaderCircleIcon bind:this={loaderRef} size={48} />
					</div>
					<div class="demo-icon" onclick={startDemoAnimations}>
						<ActivityIcon bind:this={activityRef} size={48} />
					</div>
				</div>
				<button class="demo-button btn-primary" onclick={startDemoAnimations}>
					✨ Try Animation
				</button>
			</div>
			
			<!-- CTA Buttons -->
			<div class="hero-actions animate-slide-up">
				<button class="btn-primary" onclick={scrollToGallery}>
					Browse {totalIcons()} Icons
				</button>
				<a 
					href="https://github.com/serhat-yildiz/svelte-animate-icons" 
					target="_blank" 
					rel="noopener noreferrer"
					class="btn-secondary"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
					</svg>
					View on GitHub
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: var(--space-3xl) 0;
		background: 
			radial-gradient(circle at 50% 50%, rgba(255, 62, 0, 0.1) 0%, transparent 50%),
			linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
		position: relative;
		overflow: hidden;
	}
	
	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: 
			radial-gradient(circle at 20% 20%, rgba(255, 62, 0, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(255, 107, 53, 0.05) 0%, transparent 50%);
		pointer-events: none;
	}
	
	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
		z-index: 1;
		max-width: 800px;
		margin: 0 auto;
	}
	
	.hero-badge {
		display: inline-flex;
		align-items: center;
		padding: var(--space-sm) var(--space-lg);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-2xl);
		backdrop-filter: blur(12px);
		margin-bottom: var(--space-xl);
		animation-delay: 0.1s;
	}
	
	.badge-text {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-secondary);
	}
	
	.hero-title {
		font-size: clamp(2.5rem, 8vw, 4rem);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.02em;
		margin: 0 0 var(--space-xl);
		animation-delay: 0.2s;
	}
	
	.hero-description {
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		line-height: 1.6;
		color: var(--text-secondary);
		margin: 0 0 var(--space-xl);
		max-width: 600px;
		animation-delay: 0.3s;
	}
	
	.tech-stack {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		margin-bottom: var(--space-2xl);
		animation-delay: 0.4s;
	}
	
	.tech-label {
		font-size: 0.875rem;
		color: var(--text-tertiary);
		font-weight: 500;
	}
	
	.tech-icons {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}
	
	.tech-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.tech-separator {
		color: var(--text-muted);
		font-size: 0.875rem;
	}
	
	.demo-icons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		margin-bottom: var(--space-2xl);
		animation-delay: 0.5s;
	}
	
	.icon-showcase {
		display: flex;
		gap: var(--space-lg);
		padding: var(--space-xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(12px);
	}
	
	.demo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		background: rgba(255, 62, 0, 0.1);
		border: 1px solid rgba(255, 62, 0, 0.2);
		border-radius: var(--radius-lg);
		color: var(--svelte-primary);
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.demo-icon:hover {
		background: rgba(255, 62, 0, 0.15);
		border-color: rgba(255, 62, 0, 0.4);
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(255, 62, 0, 0.2);
	}
	
	.demo-button {
		font-size: 0.875rem;
		padding: var(--space-sm) var(--space-lg);
	}
	
	.hero-actions {
		display: flex;
		gap: var(--space-lg);
		animation-delay: 0.6s;
		flex-wrap: wrap;
		justify-content: center;
	}
	
	.hero-actions .btn-primary,
	.hero-actions .btn-secondary {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-lg) var(--space-xl);
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		border-radius: var(--radius-lg);
		min-width: 180px;
		justify-content: center;
	}
	
	@media (max-width: 768px) {
		.hero {
			padding: var(--space-2xl) 0;
		}
		
		.hero-content {
			max-width: none;
		}
		
		.tech-stack {
			flex-direction: column;
			gap: var(--space-sm);
			text-align: center;
		}
		
		.icon-showcase {
			gap: var(--space-md);
			padding: var(--space-lg);
		}
		
		.demo-icon {
			width: 64px;
			height: 64px;
		}
		
		.hero-actions {
			flex-direction: column;
			align-items: center;
			gap: var(--space-md);
		}
		
		.hero-actions .btn-primary,
		.hero-actions .btn-secondary {
			width: 100%;
			max-width: 280px;
		}
	}
	
	@media (max-width: 480px) {
		.icon-showcase {
			gap: var(--space-sm);
			padding: var(--space-md);
		}
		
		.demo-icon {
			width: 56px;
			height: 56px;
		}
		
		.tech-icons {
			flex-direction: column;
			gap: var(--space-sm);
		}
	}
</style>
