<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface HeadphonesIconHandle {
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
			
			// SVG animation
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg)' },
				{ transform: 'scale(1.1) rotate(-3deg)' },
				{ transform: 'scale(0.95) rotate(3deg)' },
				{ transform: 'scale(1) rotate(-2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], { duration: 1200, easing: 'ease-in-out', iterations: Infinity });
			
			// Path earcup animation
			const path = svgRef.querySelector('path');
			if (path) {
				path.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.2)', opacity: '0.7' },
					{ transform: 'scale(0.9)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 900, easing: 'ease-in-out', iterations: Infinity });
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
				path.style.transform = '';
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
	
	export function getControls(): HeadphonesIconHandle {
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
		<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" style="transform-origin: center;" />
	</svg>
</div>
