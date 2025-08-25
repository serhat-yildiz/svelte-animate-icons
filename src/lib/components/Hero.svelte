<script lang="ts">
	import { getTotalIconCount } from '../registry/iconRegistry.js';
	import { HeartIcon, BellRingIcon, LoaderCircleIcon, ActivityIcon, SearchIcon, GithubIcon } from 'svelte-animate-icons';
	
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
					Try Animation
				</button>
			</div>
			
			<!-- CTA Buttons -->
			<div class="hero-actions animate-slide-up">
				<button class="btn-primary" onclick={scrollToGallery}>
					<SearchIcon size={18} />
					Browse {totalIcons()} Icons
				</button>
				<a 
					href="https://github.com/serhat-yildiz/svelte-animate-icons" 
					target="_blank" 
					rel="noopener noreferrer"
					class="btn-secondary"
				>
					<GithubIcon size={18} />
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
		

	}
</style>
