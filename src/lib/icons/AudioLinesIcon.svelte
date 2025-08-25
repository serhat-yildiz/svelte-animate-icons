<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface AudioLinesIconHandle {
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
			
			// Audio bars animation - each bar has different delay
			const paths = svgRef.querySelectorAll('path');
			paths.forEach((path, i) => {
				// React: scaleY: [1, 1.4, 0.6, 1], opacity: [1, 0.8, 1], delay: i * 0.2
				path.animate([
					{ transform: 'scaleY(1)', opacity: '1' },
					{ transform: 'scaleY(1.4)', opacity: '0.8' },
					{ transform: 'scaleY(0.6)', opacity: '1' },
					{ transform: 'scaleY(1)', opacity: '1' }
				], {
					duration: 1200,
					delay: i * 200, // delay: i * 0.2 * 1000
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
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				// Reset to normal state
				path.style.transform = 'scaleY(1)';
				path.style.opacity = '1';
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
	export function getControls(): AudioLinesIconHandle {
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
		<path d="M2 10v3" style="transform-origin: center;" />
		<path d="M6 6v11" style="transform-origin: center;" />
		<path d="M10 3v18" style="transform-origin: center;" />
		<path d="M14 8v7" style="transform-origin: center;" />
		<path d="M18 5v13" style="transform-origin: center;" />
		<path d="M22 10v3" style="transform-origin: center;" />
	</svg>
</div>
