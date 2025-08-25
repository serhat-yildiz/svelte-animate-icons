<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BellIconHandle {
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
			
			// Bell swing animation
			// React: rotate: [0, -18, 15, -10, 6, -3, 0]
			svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(-18deg)' },
				{ transform: 'rotate(15deg)' },
				{ transform: 'rotate(-10deg)' },
				{ transform: 'rotate(6deg)' },
				{ transform: 'rotate(-3deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: 1600,
				iterations: Infinity,
				easing: 'ease-in-out'
			});
			
			// Clapper movement animation
			// React: x: [0, -4, 4, -2, 2, 0]
			const clapper = svgRef.querySelector('path[d*="21a2"]'); // clapper path
			if (clapper) {
				clapper.animate([
					{ transform: 'translateX(0px)' },
					{ transform: 'translateX(-4px)' },
					{ transform: 'translateX(4px)' },
					{ transform: 'translateX(-2px)' },
					{ transform: 'translateX(2px)' },
					{ transform: 'translateX(0px)' }
				], {
					duration: 1600,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const clapper = svgRef.querySelector('path[d*="21a2"]');
			if (clapper) {
				clapper.getAnimations().forEach(animation => animation.cancel());
				clapper.style.transform = 'translateX(0px)';
			}
			// Reset SVG transform
			svgRef.style.transform = 'rotate(0deg)';
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
	export function getControls(): BellIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx('relative inline-flex', className)}
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
		<path d="M10.268 21a2 2 0 0 0 3.464 0" />
		<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
	</svg>
</div>