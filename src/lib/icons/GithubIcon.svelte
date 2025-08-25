<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface GithubIconHandle {
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
			
			// SVG scale
			svgRef.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.05)' },
				{ transform: 'scale(1)' }
			], { duration: 1000 });
			
			// Body path animation
			const bodyPath = svgRef.querySelector('path[d*="M15 22v-4"]');
			if (bodyPath) {
				const pathLength = bodyPath.getTotalLength();
				bodyPath.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				bodyPath.animate([
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: pathLength * 0.4, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 1000 });
			}
			
			// Hand wave animation
			const handPath = svgRef.querySelector('path[d*="M9 18c"]');
			if (handPath) {
				handPath.animate([
					{ transform: 'rotate(0deg)' },
					{ transform: 'rotate(20deg)' },
					{ transform: 'rotate(-15deg)' },
					{ transform: 'rotate(0deg)' }
				], { 
					duration: 1000, 
					iterations: Infinity,
					transformOrigin: '90% 50%'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
				path.style.transform = '';
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
	
	export function getControls(): GithubIconHandle {
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
		style="transform-origin: center;"
	>
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
		<path d="M9 18c-4.51 2-5-2-7-2" style="transform-origin: 90% 50%;" />
	</svg>
</div>
