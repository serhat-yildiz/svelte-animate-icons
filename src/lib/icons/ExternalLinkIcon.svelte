<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ExternalLinkIconHandle {
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
			
			// Arrow parts animation
			const arrowPaths = [
				svgRef.querySelector('path[d*="M15 3h6v6"]'),
				svgRef.querySelector('path[d*="M10 14 21 3"]')
			];
			
			arrowPaths.forEach(path => {
				if (path) {
					path.animate([
						{ transform: 'translateX(0px) translateY(0px)', opacity: '1' },
						{ transform: 'translateX(3px) translateY(-3px)', opacity: '1' },
						{ transform: 'translateX(0px) translateY(0px)', opacity: '1' }
					], { duration: 600, easing: 'ease-in-out' });
				}
			});
			
			// Box drawing
			const box = svgRef.querySelector('path[d*="M18 13"]');
			if (box) {
				const pathLength = box.getTotalLength();
				box.style.strokeDasharray = pathLength + ' ' + pathLength;
				box.style.strokeDashoffset = pathLength;
				
				box.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 800, easing: 'ease-in-out', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const allPaths = svgRef.querySelectorAll('path');
			allPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.transform = '';
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
	
	export function getControls(): ExternalLinkIconHandle {
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
		<path d="M15 3h6v6" />
		<path d="M10 14 21 3" />
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
	</svg>
</div>
