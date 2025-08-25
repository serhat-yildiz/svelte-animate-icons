<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BookmarkXIconHandle {
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
			
			// Bookmark shake animation
			// React: rotate: [0, -4, 4, -2, 0], scale: [1, 1.05, 0.95, 1]
			svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(-4deg) scale(1.05)' },
				{ transform: 'rotate(4deg) scale(0.95)' },
				{ transform: 'rotate(-2deg) scale(1)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], {
				duration: 1000,
				easing: 'ease-in-out'
			});
			
			// X lines drawing animation
			// React: pathLength: [0, 1], opacity: [0.8, 1]
			const xPaths = svgRef.querySelectorAll('path[d*="m14.5 7.5"], path[d*="m9.5 7.5"]'); // X paths
			xPaths.forEach(path => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.8' },
					{ strokeDashoffset: 0, opacity: '1' }
				], {
					duration: 600,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const xPaths = svgRef.querySelectorAll('path[d*="m14.5 7.5"], path[d*="m9.5 7.5"]');
			xPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
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
	export function getControls(): BookmarkXIconHandle {
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
		<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
		<path d="m14.5 7.5-5 5" />
		<path d="m9.5 7.5 5 5" />
	</svg>
</div>
