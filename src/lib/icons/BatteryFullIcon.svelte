<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BatteryFullIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	// Animation controls
	function startAnimation() {
		if (svgRef) {
			isAnimating = true;
			
			// Battery full animation - SVG rotate and scale
			// React: rotate: [0, -2, 2, 0], scale: [1, 1.05, 0.95, 1]
			svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(-2deg) scale(1.05)' },
				{ transform: 'rotate(2deg) scale(0.95)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], {
				duration: 1500,
				iterations: Infinity,
				easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
			});
			
			// Battery bars animation - each with different delay
			const bars = svgRef.querySelectorAll('path[d*="v4"]'); // bars with "v4" pattern
			bars.forEach((bar, i) => {
				// React: opacity: [0.4, 1, 0.8], scaleY: [0.6, 1, 0.8], delay: i * 0.25
				bar.animate([
					{ opacity: '0.4', transform: 'scaleY(0.6)' },
					{ opacity: '1', transform: 'scaleY(1)' },
					{ opacity: '0.8', transform: 'scaleY(0.8)' }
				], {
					duration: 1000,
					delay: i * 250, // i * 0.25 * 1000
					iterations: Infinity,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
			});
			
			// Battery shell and tip opacity animation
			const rect = svgRef.querySelector('rect');
			const tip = svgRef.querySelector('path[d*="22"]'); // tip path
			
			[rect, tip].forEach(element => {
				if (element) {
					element.animate([
						{ opacity: '0.6' },
						{ opacity: '1' },
						{ opacity: '0.7' },
						{ opacity: '1' }
					], {
						duration: 1200,
						iterations: Infinity,
						easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
					});
				}
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				// Reset styles
				element.style.transform = '';
				element.style.opacity = '1';
			});
			// Reset SVG transform
			svgRef.style.transform = 'rotate(0deg) scale(1)';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (!isControlled) {
			stopAnimation();
		}
	}
	
	// Public API
	export function getControls(): BatteryFullIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx('inline-flex', className)}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
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