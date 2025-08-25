<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BellMinusIconHandle {
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
			// React: rotate: [0, -12, 10, -6, 3, 0]
			svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(-12deg)' },
				{ transform: 'rotate(10deg)' },
				{ transform: 'rotate(-6deg)' },
				{ transform: 'rotate(3deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: 1400,
				iterations: Infinity,
				easing: 'ease-in-out'
			});
			
			// Clapper movement animation
			// React: x: [0, -3, 3, -2, 1, 0]
			const clapper = svgRef.querySelector('path[d*="21a2"]'); // clapper path
			if (clapper) {
				clapper.animate([
					{ transform: 'translateX(0px)' },
					{ transform: 'translateX(-3px)' },
					{ transform: 'translateX(3px)' },
					{ transform: 'translateX(-2px)' },
					{ transform: 'translateX(1px)' },
					{ transform: 'translateX(0px)' }
				], {
					duration: 1400,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			}
			
			// Minus line animation
			// React: scaleX: [1, 0.6, 1.2, 1], rotate: [0, -10, 10, 0], opacity: [1, 0.6, 1]
			const minus = svgRef.querySelector('path[d*="15 8h6"]'); // minus path
			if (minus) {
				minus.animate([
					{ transform: 'scaleX(1) rotate(0deg)', opacity: '1' },
					{ transform: 'scaleX(0.6) rotate(-10deg)', opacity: '0.6' },
					{ transform: 'scaleX(1.2) rotate(10deg)', opacity: '1' },
					{ transform: 'scaleX(1) rotate(0deg)', opacity: '1' }
				], {
					duration: 1200,
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
			const minus = svgRef.querySelector('path[d*="15 8h6"]');
			
			if (clapper) {
				clapper.getAnimations().forEach(animation => animation.cancel());
				clapper.style.transform = 'translateX(0px)';
			}
			if (minus) {
				minus.getAnimations().forEach(animation => animation.cancel());
				minus.style.transform = 'scaleX(1) rotate(0deg)';
				minus.style.opacity = '1';
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
	export function getControls(): BellMinusIconHandle {
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
		<path d="M15 8h6" style="transform-origin: center;" />
		<path d="M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12" />
	</svg>
</div>