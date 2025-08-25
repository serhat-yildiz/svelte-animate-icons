<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface XIcon {
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
			// Fallback hover animation
			svgRef.animate([
				{ opacity: '0.7', transform: 'scale(1)' },
				{ opacity: '1', transform: 'scale(1.05)' },
				{ opacity: '0.7', transform: 'scale(1)' }
			], {
				duration: 800,
				easing: 'ease-in-out'
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			// Path animasyonlarını da durdur
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
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
	export function getControls(): XIcon {
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
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
</div>