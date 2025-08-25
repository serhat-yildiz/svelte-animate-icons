<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface InstagramIconHandle {
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
				{ transform: 'scale(1.08) rotate(-2deg)' },
				{ transform: 'scale(0.95) rotate(2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], { duration: 1300, easing: 'ease-in-out', iterations: Infinity });
			
			// Drawing elements
			const drawElements = svgRef.querySelectorAll('rect, path');
			drawElements.forEach(element => {
				const pathLength = element.getTotalLength();
				element.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				element.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 1500, easing: 'ease-in-out', iterations: Infinity });
			});
			
			// Pulse dot
			const dot = svgRef.querySelector('line');
			if (dot) {
				dot.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.4)', opacity: '0.4' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 1000, easing: 'ease-in-out', iterations: Infinity });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				element.style.transform = '';
				element.style.strokeDasharray = '';
				element.style.strokeDashoffset = '';
				element.style.opacity = '1';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): InstagramIconHandle {
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
		<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" style="transform-origin: center;" />
	</svg>
</div>
