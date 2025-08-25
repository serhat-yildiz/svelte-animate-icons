<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface InfoIconHandle {
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
			
			// SVG rotation and scale
			svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(-2deg) scale(1.08)' },
				{ transform: 'rotate(2deg) scale(0.95)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], { duration: 1400, easing: 'ease-in-out', iterations: Infinity });
			
			// Circle drawing
			const circle = svgRef.querySelector('circle');
			if (circle) {
				const pathLength = circle.getTotalLength();
				circle.style.strokeDasharray = pathLength + ' ' + pathLength;
				
				circle.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 1500, easing: 'ease-in-out', iterations: Infinity });
			}
			
			// Info "i" parts pulse
			const infoPaths = svgRef.querySelectorAll('path');
			infoPaths.forEach(path => {
				path.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.3)', opacity: '0.5' },
					{ transform: 'scale(0.8)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 1000, easing: 'ease-in-out', iterations: Infinity });
			});
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
	
	export function getControls(): InfoIconHandle {
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
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" style="transform-origin: center;" />
		<path d="M12 8h.01" style="transform-origin: center;" />
	</svg>
</div>
