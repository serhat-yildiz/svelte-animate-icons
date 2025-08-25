<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ChevronUpIconHandle {
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
			
			// Leading arrow (second path)
			// React: y: [0, -4, 0], opacity: [1, 0.6, 1]
			if (paths[1]) {
				paths[1].animate([
					{ transform: 'translateY(0px)', opacity: '1' },
					{ transform: 'translateY(-4px)', opacity: '0.6' },
					{ transform: 'translateY(0px)', opacity: '1' }
				], {
					duration: 800,
					iterations: Infinity
				});
			}
			
			// Trailing arrow (first path) with delay
			// React: y: [0, -6, 0], opacity: [0.5, 0.2, 0.5], delay: 0.2
			if (paths[0]) {
				paths[0].animate([
					{ transform: 'translateY(0px)', opacity: '0.5' },
					{ transform: 'translateY(-6px)', opacity: '0.2' },
					{ transform: 'translateY(0px)', opacity: '0.5' }
				], {
					duration: 800,
					delay: 200,
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
				path.style.transform = 'translateY(0px)';
				// Reset opacity based on which path it is
				path.style.opacity = index === 0 ? '0.5' : '1';
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
	export function getControls(): ChevronUpIconHandle {
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
		<path d="m18 15-6-6-6 6" stroke="currentColor" style="opacity: 0.5;" />
		<path d="m18 15-6-6-6 6" stroke="currentColor" />
	</svg>
</div>
