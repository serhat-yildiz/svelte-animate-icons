<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface SearchIcon {
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
			// Search zoom animation
			svgRef.animate([
				{ transform: 'scale(1)', opacity: '0.7' },
				{ transform: 'scale(1.15)', opacity: '1' },
				{ transform: 'scale(1)', opacity: '0.7' }
			], {
				duration: 800,
				easing: 'ease-in-out'
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				// Reset stroke properties
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
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
	export function getControls(): SearchIcon {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx(className)}
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
		<path d="m21 21-4.35-4.35" />
		<path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
	</svg>
</div>