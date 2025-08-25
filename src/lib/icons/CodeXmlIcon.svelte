<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CodeXmlIconHandle {
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
			
			// Left arrow drawing
			const leftArrow = svgRef.querySelector('path[d*="m6 8"]');
			if (leftArrow) {
				const pathLength = leftArrow.getTotalLength();
				leftArrow.style.strokeDasharray = pathLength + ' ' + pathLength;
				leftArrow.style.strokeDashoffset = pathLength;
				
				leftArrow.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Right arrow drawing (delay: 0.1)
			const rightArrow = svgRef.querySelector('path[d*="m18 16"]');
			if (rightArrow) {
				const pathLength = rightArrow.getTotalLength();
				rightArrow.style.strokeDasharray = pathLength + ' ' + pathLength;
				rightArrow.style.strokeDashoffset = pathLength;
				
				rightArrow.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 700, delay: 100, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Slash animation
			const slash = svgRef.querySelector('path[d*="m14.5 4"]');
			if (slash) {
				const pathLength = slash.getTotalLength();
				slash.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				slash.animate([
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: pathLength, opacity: '0.4' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 1000, easing: 'ease-in-out' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const allPaths = svgRef.querySelectorAll('path');
			allPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): CodeXmlIconHandle {
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
	>
		<path d="m6 8-4 4 4 4" />
		<path d="m18 16 4-4-4-4" />
		<path d="m14.5 4-5 16" />
	</svg>
</div>
