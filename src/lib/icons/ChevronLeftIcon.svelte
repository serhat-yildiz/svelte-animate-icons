<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ChevronLeftIconHandle {
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
			
			const paths = svgRef.querySelectorAll('path');
			
			// Main arrow animation
			// React: x: [0, -4, 0], opacity: [1, 0.6, 1]
			if (paths[1]) {
				paths[1].animate([
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(-4px)', opacity: '0.6' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], {
					duration: 800,
					iterations: Infinity
				});
			}
			
			// Trail arrow animation
			// React: x: [-6, -10], opacity: [0.4, 0]
			if (paths[0]) {
				paths[0].animate([
					{ transform: 'translateX(-6px)', opacity: '0.4' },
					{ transform: 'translateX(-10px)', opacity: '0' }
				], {
					duration: 800,
					iterations: Infinity
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			const paths = svgRef.querySelectorAll('path');
			paths.forEach((path, index) => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.transform = 'translateX(0px)';
				// Reset opacity based on which path it is
				path.style.opacity = index === 0 ? '0' : '1';
			});
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
	export function getControls(): ChevronLeftIconHandle {
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
		<path d="m15 18-6-6 6-6" stroke="currentColor" style="opacity: 0;" />
		<path d="m15 18-6-6 6-6" />
	</svg>
</div>
