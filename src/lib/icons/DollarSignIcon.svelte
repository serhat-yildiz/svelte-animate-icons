<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface DollarSignIconHandle {
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
			
			// Spine line drawing
			const spine = svgRef.querySelector('line');
			if (spine) {
				const pathLength = Math.sqrt(Math.pow(20, 2)); // vertical line length
				spine.style.strokeDasharray = pathLength + ' ' + pathLength;
				spine.style.strokeDashoffset = pathLength;
				
				spine.animate([
					{ strokeDashoffset: pathLength, opacity: '0.8' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 800, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// S-curve drawing
			const path = svgRef.querySelector('path');
			if (path) {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 900, easing: 'ease-in-out', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const elements = svgRef.querySelectorAll('line, path');
			elements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				element.style.strokeDasharray = '';
				element.style.strokeDashoffset = '';
				element.style.opacity = '1';
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
	
	export function getControls(): DollarSignIconHandle {
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
		<line x1="12" x2="12" y1="2" y2="22" />
		<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
	</svg>
</div>
