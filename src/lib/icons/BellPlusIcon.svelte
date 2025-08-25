<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BellPlusIconHandle {
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
			// React: x: [0, -3, 3, -2, 2, 0]
			const clapper = svgRef.querySelector('path[d*="21a2"]'); // clapper path
			if (clapper) {
				clapper.animate([
					{ transform: 'translateX(0px)' },
					{ transform: 'translateX(-3px)' },
					{ transform: 'translateX(3px)' },
					{ transform: 'translateX(-2px)' },
					{ transform: 'translateX(2px)' },
					{ transform: 'translateX(0px)' }
				], {
					duration: 1400,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			}
			
			// Plus cross animation
			// React: scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, 45, -45, 0], opacity: [1, 0.9, 1]
			const plusPaths = svgRef.querySelectorAll('path[d*="15 8h6"], path[d*="18 5v6"]'); // plus paths
			plusPaths.forEach(path => {
				path.animate([
					{ transform: 'scale(1) rotate(0deg)', opacity: '1' },
					{ transform: 'scale(1.3) rotate(45deg)', opacity: '0.9' },
					{ transform: 'scale(0.9) rotate(-45deg)', opacity: '1' },
					{ transform: 'scale(1.1) rotate(0deg)', opacity: '1' },
					{ transform: 'scale(1) rotate(0deg)', opacity: '1' }
				], {
					duration: 1400,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const clapper = svgRef.querySelector('path[d*="21a2"]');
			const plusPaths = svgRef.querySelectorAll('path[d*="15 8h6"], path[d*="18 5v6"]');
			
			if (clapper) {
				clapper.getAnimations().forEach(animation => animation.cancel());
				clapper.style.transform = 'translateX(0px)';
			}
			plusPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.transform = 'scale(1) rotate(0deg)';
				path.style.opacity = '1';
			});
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
	export function getControls(): BellPlusIconHandle {
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
		<path d="M18 5v6" style="transform-origin: center;" />
		<path d="M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332" />
	</svg>
</div>