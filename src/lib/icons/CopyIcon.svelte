<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CopyIconHandle {
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
			
			// Box animation (translate + rotate)
			const rect = svgRef.querySelector('rect');
			if (rect) {
				rect.animate([
					{ transform: 'translateY(0px) translateX(0px) rotate(0deg)' },
					{ transform: 'translateY(-3px) translateX(-3px) rotate(360deg)' }
				], { 
					duration: 700, 
					easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
					fill: 'forwards'
				});
			}
			
			// Path animation
			const path = svgRef.querySelector('path');
			if (path) {
				path.animate([
					{ transform: 'translateX(0px) translateY(0px)' },
					{ transform: 'translateX(3px) translateY(3px)' }
				], { 
					duration: 700, 
					easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
					fill: 'forwards'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const elements = svgRef.querySelectorAll('rect, path');
			elements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				element.style.transform = '';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): CopyIconHandle {
		isControlled = true;
		return { startAnimation, stopAnimation };
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
		<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
		<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
	</svg>
</div>
