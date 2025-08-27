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
			
			// Get all paths for complex animation
			const zapPaths = svgRef.querySelectorAll('path:not([d*="m2 2 20 20"])'); // Lightning paths
			const crossPath = svgRef.querySelector('path[d*="m2 2 20 20"]'); // Cross-out line
			
			// Phase 1: Lightning appears with energy
			zapPaths.forEach((path, index) => {
				const pathElement = path as SVGPathElement;
				const pathLength = pathElement.getTotalLength();
				
				// Initial state - hidden
				pathElement.style.strokeDasharray = `${pathLength}`;
				pathElement.style.strokeDashoffset = `${pathLength}`;
				pathElement.style.opacity = '0';
				pathElement.style.filter = 'drop-shadow(0 0 4px currentColor)';
				
				// Animate lightning drawing in
				const lightningAnimation = pathElement.animate([
					{ 
						strokeDashoffset: `${pathLength}`, 
						opacity: '0',
						transform: 'scale(0.8)',
						filter: 'drop-shadow(0 0 2px currentColor)'
					},
					{ 
						strokeDashoffset: '0', 
						opacity: '1',
						transform: 'scale(1.1)',
						filter: 'drop-shadow(0 0 8px currentColor)'
					},
					{ 
						strokeDashoffset: '0', 
						opacity: '1',
						transform: 'scale(1)',
						filter: 'drop-shadow(0 0 4px currentColor)'
					}
				], {
					duration: duration * 0.4,
					delay: index * 100,
					easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					fill: 'forwards'
				});
			});
			
			// Phase 2: Lightning flickers with power
			setTimeout(() => {
				zapPaths.forEach((path) => {
					const pathElement = path as SVGPathElement;
					pathElement.animate([
						{ opacity: '1', filter: 'drop-shadow(0 0 4px currentColor)' },
						{ opacity: '0.7', filter: 'drop-shadow(0 0 2px currentColor)' },
						{ opacity: '1', filter: 'drop-shadow(0 0 6px currentColor)' },
						{ opacity: '0.8', filter: 'drop-shadow(0 0 3px currentColor)' },
						{ opacity: '1', filter: 'drop-shadow(0 0 4px currentColor)' }
					], {
						duration: duration * 0.3,
						easing: 'ease-in-out'
					});
				});
			}, duration * 0.4);
			
			// Phase 3: Cross line appears to "turn off" the lightning
			if (crossPath) {
				const crossElement = crossPath as SVGPathElement;
				const crossLength = crossElement.getTotalLength();
				
				setTimeout(() => {
					crossElement.style.strokeDasharray = `${crossLength}`;
					crossElement.style.strokeDashoffset = `${crossLength}`;
					crossElement.style.opacity = '0';
					crossElement.style.strokeWidth = '3';
					crossElement.style.filter = 'drop-shadow(0 0 2px #ff4444)';
					
					const crossAnimation = crossElement.animate([
						{ 
							strokeDashoffset: `${crossLength}`, 
							opacity: '0',
							filter: 'drop-shadow(0 0 2px #ff4444)'
						},
						{ 
							strokeDashoffset: '0', 
							opacity: '1',
							filter: 'drop-shadow(0 0 6px #ff4444)'
						}
					], {
						duration: duration * 0.2,
						easing: 'cubic-bezier(0.55, 0.05, 0.68, 0.19)',
						fill: 'forwards'
					});
				}, duration * 0.7);
			}
			
			// Phase 4: Lightning fades out as it's "turned off"
			setTimeout(() => {
				zapPaths.forEach((path, index) => {
					const pathElement = path as SVGPathElement;
					pathElement.animate([
						{ 
							opacity: '1', 
							transform: 'scale(1)',
							filter: 'drop-shadow(0 0 4px currentColor)'
						},
						{ 
							opacity: '0.3', 
							transform: 'scale(0.95)',
							filter: 'drop-shadow(0 0 1px currentColor)'
						},
						{ 
							opacity: '0.1', 
							transform: 'scale(0.9)',
							filter: 'none'
						}
					], {
						duration: duration * 0.25,
						delay: index * 50,
						easing: 'ease-out',
						fill: 'forwards'
					});
				});
			}, duration * 0.75);
			
			// Set up the main animation reference for cleanup
			currentAnimation = {
				cancel: () => {
					zapPaths.forEach(path => {
						(path as SVGPathElement).getAnimations().forEach(anim => anim.cancel());
					});
					if (crossPath) {
						(crossPath as SVGPathElement).getAnimations().forEach(anim => anim.cancel());
					}
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
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			// Reset all paths to their default state
			const allPaths = svgRef.querySelectorAll('path');
			allPaths.forEach(path => {
				const pathElement = path as SVGPathElement;
				pathElement.style.strokeDasharray = 'none';
				pathElement.style.strokeDashoffset = '';
				pathElement.style.opacity = '1';
				pathElement.style.transform = '';
				pathElement.style.filter = '';
				pathElement.style.strokeWidth = '';
				
				// Cancel any running animations
				pathElement.getAnimations().forEach(anim => anim.cancel());
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
  aria-label="zap-off-icon icon"
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
<path d="M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317" />
		<path d="M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773" />
		<path
			d="M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643"
		/>
		<path d="m2 2 20 20" />
  </svg>
</div>