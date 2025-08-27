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
			
			const door = svgRef.querySelector('.vault-door');
			const handle = svgRef.querySelector('.handle');
			const lockOuter = svgRef.querySelector('.lock-outer');
			const lockInner = svgRef.querySelector('.lock-inner');
			
			if (door && handle && lockOuter && lockInner) {
				// Phase 1: Lock spinning
				setTimeout(() => {
					animateLockSpinning(lockOuter, lockInner);
				}, 100);
				
				// Phase 2: Door opening
				setTimeout(() => {
					animateDoorOpening(door, handle);
				}, duration * 0.4);
				
				// Set up animation management
				currentAnimation = {
					cancel: () => {
						stopVaultAnimations();
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
	
	function animateLockSpinning(lockOuter: Element, lockInner: Element) {
		// Outer lock rotates
		(lockOuter as SVGElement).style.transformOrigin = '12px 12px';
		(lockOuter as SVGElement).animate([
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(180deg)' },
			{ transform: 'rotate(360deg)' }
		], {
			duration: duration * 0.3,
			easing: 'ease-in-out'
		});
		
		// Inner lock counter-rotates
		(lockInner as SVGElement).style.transformOrigin = '12px 12px';
		(lockInner as SVGElement).animate([
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(-90deg)' },
			{ transform: 'rotate(-180deg)' }
		], {
			duration: duration * 0.3,
			easing: 'ease-in-out'
		});
	}
	
	function animateDoorOpening(door: Element, handle: Element) {
		// Set pivot point at the left edge (hinges)
		(door as SVGElement).style.transformOrigin = '5px 12px';
		(handle as SVGElement).style.transformOrigin = '5px 12px';
		
		// Door opens
		(door as SVGElement).animate([
			{ transform: 'rotateY(0deg)' },
			{ transform: 'rotateY(-120deg)' }
		], {
			duration: duration * 0.5,
			easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fill: 'forwards'
		});
		
		// Handle follows door
		(handle as SVGElement).animate([
			{ transform: 'rotateY(0deg)' },
			{ transform: 'rotateY(-120deg)' }
		], {
			duration: duration * 0.5,
			easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fill: 'forwards'
		});
	}
	
	function stopVaultAnimations() {
		if (svgRef) {
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				(element as SVGElement).getAnimations().forEach(anim => anim.cancel());
			});
		}
	}
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			// Stop all animations
			stopVaultAnimations();
			
			// Reset all elements to default state
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				const el = element as SVGElement;
				el.style.transform = '';
				el.style.transformOrigin = '';
			});
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
  aria-label="vault-icon icon"
  {...restProps}
>
  <svg
    bind:this={svgRef}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- Vault body -->
    <rect x="3" y="4" width="18" height="16" rx="2" class="vault-body" />
    
    <!-- Vault door -->
    <rect x="5" y="6" width="14" height="12" rx="1" class="vault-door" />
    
    <!-- Door handle -->
    <circle cx="16" cy="12" r="1.5" class="handle" />
    
    <!-- Lock mechanism -->
    <circle cx="12" cy="12" r="3" class="lock-outer" />
    <circle cx="12" cy="12" r="1" class="lock-inner" />
    
    <!-- Hinges -->
    <rect x="4.5" y="8" width="0.5" height="2" class="hinge" />
    <rect x="4.5" y="14" width="0.5" height="2" class="hinge" />
  </svg>
</div>