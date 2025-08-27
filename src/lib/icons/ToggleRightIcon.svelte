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
			
			const circle = svgRef.querySelector('circle');
			const rect = svgRef.querySelector('rect');
			
			if (circle && rect) {
				// Phase 1: Highlight the toggle track
				setTimeout(() => {
					animateTrackHighlight(rect);
				}, 100);
				
				// Phase 2: Slide circle from right to left (ON to OFF)
				setTimeout(() => {
					animateCircleSlide(circle);
				}, duration * 0.3);
				
				// Set up animation management
				currentAnimation = {
					cancel: () => {
						stopToggleAnimations();
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
	
	function animateTrackHighlight(rect: Element) {
		// Track dims to indicate deactivation
		(rect as SVGElement).animate([
			{ 
				opacity: '1',
				filter: 'drop-shadow(0 0 2px currentColor)'
			},
			{ 
				opacity: '0.7',
				filter: 'drop-shadow(0 0 1px currentColor)'
			},
			{ 
				opacity: '1',
				filter: 'drop-shadow(0 0 0px currentColor)'
			}
		], {
			duration: duration * 0.4,
			easing: 'ease-in-out',
			fill: 'forwards'
		});
	}
	
	function animateCircleSlide(circle: Element) {
		// Circle slides from right (cx=15) to left (cx=9)
		(circle as SVGElement).animate([
			{ 
				transform: 'translateX(0px)',
				filter: 'drop-shadow(0 0 2px currentColor)'
			},
			{ 
				transform: 'translateX(-3px)',
				filter: 'drop-shadow(0 0 4px currentColor)'
			},
			{ 
				transform: 'translateX(-6px)',
				filter: 'drop-shadow(0 0 1px currentColor)'
			}
		], {
			duration: duration * 0.5,
			easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fill: 'forwards'
		});
	}
	
	function stopToggleAnimations() {
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
			
			// Stop all toggle animations
			stopToggleAnimations();
			
			// Reset elements to default state
			const circle = svgRef.querySelector('circle');
			const rect = svgRef.querySelector('rect');
			
			if (circle) {
				(circle as SVGElement).style.transform = '';
				(circle as SVGElement).style.filter = '';
			}
			
			if (rect) {
				(rect as SVGElement).style.filter = '';
				(rect as SVGElement).style.opacity = '1';
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
  aria-label="toggle-right-icon icon"
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
<circle cx="15" cy="12" r="3"  />
		<rect width="20" height="14" x="2" y="5" rx="7" />
  </svg>
</div>