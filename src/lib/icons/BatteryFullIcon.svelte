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
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimations: Animation[] = [];
	let currentState = $state(animationState);
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Battery full animation - SVG rotate and scale
			const svgAnimation = svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(-2deg) scale(1.05)' },
				{ transform: 'rotate(2deg) scale(0.95)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], {
				duration: duration,
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
			});
			currentAnimations.push(svgAnimation);
			
			// Battery bars animation - each with different delay
			const bars = svgRef.querySelectorAll('path[d*="v4"]'); // bars with "v4" pattern
			bars.forEach((bar, i) => {
				const barAnimation = bar.animate([
					{ opacity: '0.4', transform: 'scaleY(0.6)' },
					{ opacity: '1', transform: 'scaleY(1)' },
					{ opacity: '0.8', transform: 'scaleY(0.8)' }
				], {
					duration: Math.floor(duration * 0.5),
					delay: i * 250,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(barAnimation);
			});
			
			// Battery shell and tip opacity animation
			const rect = svgRef.querySelector('rect');
			const tip = svgRef.querySelector('path[d*="22"]'); // tip path
			
			[rect, tip].forEach(element => {
				if (element) {
					const elementAnimation = element.animate([
						{ opacity: '0.6' },
						{ opacity: '1' },
						{ opacity: '0.7' },
						{ opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
					});
					currentAnimations.push(elementAnimation);
				}
			});
			
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
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.style.transform = '';
				element.style.opacity = '1';
			});
			// Reset SVG transform
			svgRef.style.transform = 'rotate(0deg) scale(1)';
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
	
	// Reactive state changes - update animation when state prop changes
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
	tabindex={triggers.focus ? 0 : -1}
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
		<path d="M10 10v4" style="transform-origin: center;" />
		<path d="M14 10v4" style="transform-origin: center;" />
		<path d="M6 10v4" style="transform-origin: center;" />
		<rect x="2" y="6" width="16" height="12" rx="2" />
		<path d="M22 14v-4" />
	</svg>
</div>