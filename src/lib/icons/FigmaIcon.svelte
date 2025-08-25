<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface FigmaIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	const paths = [
		"M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",
		"M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",
		"M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",
		"M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",
		"M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"
	];
	
	function startAnimation() {
		if (svgRef) {
			isAnimating = true;
			
			// SVG scale and rotate
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg)' },
				{ transform: 'scale(1.05) rotate(-2deg)' },
				{ transform: 'scale(0.95) rotate(2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], { duration: 1400, easing: 'ease-in-out', iterations: Infinity });
			
			// Shape drawing with stagger
			const pathElements = svgRef.querySelectorAll('path');
			pathElements.forEach((path, i) => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { 
					duration: 1200, 
					delay: i * 250, 
					easing: 'ease-in-out', 
					iterations: Infinity 
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const pathElements = svgRef.querySelectorAll('path');
			pathElements.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
			});
			svgRef.style.transform = '';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): FigmaIconHandle {
		isControlled = true;
		return { startAnimation, stopAnimation };
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
		style="transform-origin: center;"
	>
		{#each paths as d, i}
			<path {d} />
		{/each}
	</svg>
</div>
