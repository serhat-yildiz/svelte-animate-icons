<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface EuroIconHandle {
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
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
				{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
				{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
			], { duration: 1200, easing: 'ease-in-out' });
			
			// Top stroke (delay: 0.06)
			const topStroke = svgRef.querySelector('path[d*="M4 10h12"]:not([opacity])');
			if (topStroke) {
				const pathLength = topStroke.getTotalLength();
				topStroke.style.strokeDasharray = pathLength + ' ' + pathLength;
				topStroke.style.strokeDashoffset = pathLength;
				
				topStroke.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 500, delay: 60, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Mid stroke (delay: 0.16)
			const midStroke = svgRef.querySelector('path[d*="M4 14h9"]:not([opacity])');
			if (midStroke) {
				const pathLength = midStroke.getTotalLength();
				midStroke.style.strokeDasharray = pathLength + ' ' + pathLength;
				midStroke.style.strokeDashoffset = pathLength;
				
				midStroke.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 600, delay: 160, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Curve stroke (delay: 0.26)
			const curveStroke = svgRef.querySelector('path[d*="M19 6"]:not([opacity])');
			if (curveStroke) {
				const pathLength = curveStroke.getTotalLength();
				curveStroke.style.strokeDasharray = pathLength + ' ' + pathLength;
				curveStroke.style.strokeDashoffset = pathLength;
				
				curveStroke.animate([
					{ strokeDashoffset: pathLength, opacity: '0.8' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 900, delay: 260, easing: 'ease-in-out', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const animatedPaths = svgRef.querySelectorAll('path:not([opacity])');
			animatedPaths.forEach(path => {
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
	
	export function getControls(): EuroIconHandle {
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
		class="lucide lucide-euro-icon lucide-euro"
	>
		<g opacity="0.35">
			<path d="M4 10h12" />
			<path d="M4 14h9" />
			<path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
		</g>
		
		<path d="M4 10h12" />
		<path d="M4 14h9" />
		<path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
	</svg>
</div>
