<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface FramerIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	function startAnimation() {
		if (svgRef) {
			isAnimating = true;
			
			// SVG scale and rotate
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg)' },
				{ transform: 'scale(1.07) rotate(-2deg)' },
				{ transform: 'scale(0.95) rotate(2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], { duration: 1400, easing: 'ease-in-out', iterations: Infinity });
			
			// Path drawing
			const path = svgRef.querySelector('path');
			if (path) {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 1500, easing: 'ease-in-out', iterations: Infinity });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const path = svgRef.querySelector('path');
			if (path) {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
			}
			svgRef.style.transform = '';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): FramerIconHandle {
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
		<path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
	</svg>
</div>
