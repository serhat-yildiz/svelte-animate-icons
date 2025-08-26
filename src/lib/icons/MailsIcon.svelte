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
		duration = 1600,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
	
	// Refs for animation elements
	let flapEl: SVGPathElement;
	let outlinePath1El: SVGPathElement;
	let outlineRectEl: SVGRectElement;
  
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// SVG bounce animation
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'translateY(0px) scale(1)' },
					{ transform: 'translateY(-3px) scale(1.05)' },
					{ transform: 'translateY(3px) scale(0.95)' },
					{ transform: 'translateY(-2px) scale(1)' },
					{ transform: 'translateY(0px) scale(1)' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(svgAnimation);
			}
			
			// Flap animation
			if (flapEl) {
				const flapAnimation = flapEl.animate([
					{ transform: 'rotate(-4deg)', opacity: '1' },
					{ transform: 'rotate(4deg)', opacity: '0.7' },
					{ transform: 'rotate(-3deg)', opacity: '1' },
					{ transform: 'rotate(0deg)', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.75),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(flapAnimation);
			}
			
			// Outline path animation
			if (outlinePath1El) {
				const outlineAnimation = outlinePath1El.animate([
					{ opacity: '0.7' },
					{ opacity: '1' },
					{ opacity: '0.5' },
					{ opacity: '1' }
				], {
					duration: Math.floor(duration * 0.875),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(outlineAnimation);
			}
			
			// Outline rect animation
			if (outlineRectEl) {
				const rectAnimation = outlineRectEl.animate([
					{ opacity: '0.7' },
					{ opacity: '1' },
					{ opacity: '0.5' },
					{ opacity: '1' }
				], {
					duration: Math.floor(duration * 0.875),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(rectAnimation);
			}
			
			// Handle animation completion
			const lastAnimation = currentAnimations[currentAnimations.length - 1];
			lastAnimation?.addEventListener('finish', () => {
				if (!loop && !autoPlay && currentState !== 'loading') {
					if (currentAnimations.every(anim => anim.playState === 'finished')) {
						stopAnimation();
					}
				}
				onAnimationEnd?.();
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => {
			animation.cancel();
		});
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			// Reset all elements to normal state
			svgRef.style.transform = 'translateY(0px) scale(1)';
			
			if (flapEl) {
				flapEl.style.transform = 'rotate(0deg)';
				flapEl.style.opacity = '1';
			}
			
			if (outlinePath1El) {
				outlinePath1El.style.opacity = '1';
			}
			
			if (outlineRectEl) {
				outlineRectEl.style.opacity = '1';
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
		
		// State-based animation logic
		switch (newState) {
			case 'active':
			case 'loading':
			case 'success':
				startAnimation();
				break;
			case 'idle':
			case 'error':
			default:
				stopAnimation();
				break;
		}
	}
	
	// Event handlers
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
	
	// Reactive state changes
	$effect(() => {
		if (svgRef) {
			setAnimationState(animationState);
		}
	});
	
	// Auto-play on mount
	$effect(() => {
		if (autoPlay && svgRef) {
			startAnimation();
		}
		
		// Cleanup on destroy
		return () => {
			stopAnimation();
		};
	});
	
	// Public API for external control
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
	
	export function getStatus() {
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
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
	tabindex={triggers.focus ? 0 : undefined}
	role={triggers.click || triggers.focus ? "button" : undefined}
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
		<path
			bind:this={outlinePath1El}
			d="M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732"
		/>
		<path
			bind:this={flapEl}
			d="m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5"
		/>
		<rect
			bind:this={outlineRectEl}
			x="7"
			y="3"
			width="15"
			height="12"
			rx="2"
		/>
	</svg>
</div>
