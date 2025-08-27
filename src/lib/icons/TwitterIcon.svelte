<script lang="ts">
	import { clsx } from 'clsx';
	
	interface AnimationTriggers {
		hover?: boolean;
		click?: boolean;
		focus?: boolean;
		custom?: boolean;
	}
	
	interface Props {
		size?: number;
		class?: string;
		triggers?: AnimationTriggers;
		animationState?: 'idle' | 'active' | 'loading' | 'success' | 'error';
		autoPlay?: boolean;
		loop?: boolean;
		duration?: number;
		onAnimationStart?: () => void;
		onAnimationEnd?: () => void;
		[key: string]: any;
	}
	
	let { 
		size = 28, 
		class: className, 
		triggers = { hover: true },
		animationState = 'idle',
		autoPlay = false,
		loop = false,
		duration = 2000,
		onAnimationStart,
		onAnimationEnd,
		...restProps 
	}: Props = $props();
	
	export interface IconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
		toggleAnimation: () => void;
		setAnimationState: (newState: string) => void;
		readonly isAnimating: boolean;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimation: Animation | null = null;
	let currentState = $state(animationState);
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			const bird = svgRef.querySelector('.twitter-bird');
			if (bird) {
				// Phase 1: Bird appears and prepares to fly
				setTimeout(() => {
					animateBirdAppear();
				}, 100);
				
				// Phase 2: Flying motion
				setTimeout(() => {
					animateBirdFly();
				}, duration * 0.3);
				
				// Phase 3: Gentle floating
				setTimeout(() => {
					animateBirdFloat();
				}, duration * 0.7);
				
				// Set up animation management
				currentAnimation = {
					cancel: () => {
						stopBirdAnimations();
					},
					addEventListener: (event: string, callback: () => void) => {
						if (event === 'finish') {
							setTimeout(() => {
								if (!loop && !autoPlay && currentState !== 'loading') {
									stopAnimation();
								}
								onAnimationEnd?.();
							}, duration);
						}
					}
				} as Animation;
				
				// Auto-finish handling
				setTimeout(() => {
					if (!loop && !autoPlay && currentState !== 'loading') {
						stopAnimation();
					}
					onAnimationEnd?.();
				}, duration);
			}
		}
	}
	
	function animateBirdAppear() {
		const bird = svgRef?.querySelector('.twitter-bird');
		if (!bird) return;
		
		// Bird appears with a gentle scale-in
		(bird as SVGElement).animate([
			{ 
				opacity: '0',
				transform: 'scale(0.8) translateY(5px)'
			},
			{ 
				opacity: '1',
				transform: 'scale(1) translateY(0px)'
			}
		], {
			duration: duration * 0.3,
			easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
			fill: 'forwards'
		});
	}
	
	function animateBirdFly() {
		const bird = svgRef?.querySelector('.twitter-bird');
		if (!bird) return;
		
		// Flying motion with wing-like movement
		(bird as SVGElement).animate([
			{ 
				transform: 'scale(1) translateY(0px) rotate(0deg)'
			},
			{ 
				transform: 'scale(1.05) translateY(-2px) rotate(-2deg)'
			},
			{ 
				transform: 'scale(0.98) translateY(1px) rotate(1deg)'
			},
			{ 
				transform: 'scale(1.02) translateY(-1px) rotate(-1deg)'
			},
			{ 
				transform: 'scale(1) translateY(0px) rotate(0deg)'
			}
		], {
			duration: duration * 0.4,
			easing: 'ease-in-out'
		});
	}
	
	function animateBirdFloat() {
		const bird = svgRef?.querySelector('.twitter-bird');
		if (!bird) return;
		
		// Gentle floating motion
		(bird as SVGElement).animate([
			{ 
				transform: 'scale(1) translateY(0px)'
			},
			{ 
				transform: 'scale(1.01) translateY(-1px)'
			},
			{ 
				transform: 'scale(1) translateY(0px)'
			},
			{ 
				transform: 'scale(0.99) translateY(0.5px)'
			},
			{ 
				transform: 'scale(1) translateY(0px)'
			}
		], {
			duration: duration * 0.3,
			easing: 'ease-in-out'
		});
	}
	
	function stopBirdAnimations() {
		if (svgRef) {
			const bird = svgRef.querySelector('.twitter-bird');
			if (bird) {
				(bird as SVGElement).getAnimations().forEach(anim => anim.cancel());
			}
		}
	}
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			// Stop bird animations
			stopBirdAnimations();
			
			// Reset bird to default state
			const bird = svgRef.querySelector('.twitter-bird');
			if (bird) {
				(bird as SVGElement).style.transform = '';
				(bird as SVGElement).style.opacity = '1';
			}
		}
	}
	
	function toggleAnimation() {
		if (isAnimating) {
			stopAnimation();
		} else {
			startAnimation();
		}
	}
	
	function setAnimationState(newState: string) {
		currentState = newState as any;
		
		
		switch (newState) {
			case 'active':
			case 'loading':
				startAnimation();
				break;
			case 'idle':
			case 'success':
			case 'error':
			default:
				stopAnimation();
				break;
		}
	}
	
	
	function handleMouseEnter() {
		if (triggers.hover && !triggers.custom) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (triggers.hover && !triggers.custom) {
			stopAnimation();
		}
	}
	
	function handleClick() {
		if (triggers.click) {
			toggleAnimation();
		}
	}
	
	function handleFocus() {
		if (triggers.focus) {
			startAnimation();
		}
	}
	
	function handleBlur() {
		if (triggers.focus) {
			stopAnimation();
		}
	}
	
	
	$effect(() => {
		if (svgRef) {
			setAnimationState(animationState);
		}
	});
	
	
	$effect(() => {
		if (autoPlay && svgRef) {
			startAnimation();
		}
		
		
		return () => {
			stopAnimation();
		};
	});
	
	
	export function start() {
		startAnimation();
	}
	
	export function stop() {
		stopAnimation();
	}
	
	export function toggle() {
		toggleAnimation();
	}
	
	export function setState(state: string) {
		setAnimationState(state);
	}
	
	export function getIconStatus() {
		return {
			isAnimating,
			currentState
		};
	}
</script>
<div 
  bind:this={containerRef}
  class={clsx('inline-flex', className)}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  role={triggers.click || triggers.focus ? 'button' : 'img'}
  aria-label="twitter-icon icon"
  {...restProps}
>
  <svg
    bind:this={svgRef}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
  >
    <!-- Twitter bird path adapted for 24x24 viewBox -->
    <path 
      d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
      class="twitter-bird"
    />
  </svg>
</div>