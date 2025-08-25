<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 32, class: className, ...restProps }: Props = $props();
	
	export interface CircleCheckBigIconHandle {
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
			
			// SVG scale animation
			svgRef.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.05)' },
				{ transform: 'scale(0.98)' },
				{ transform: 'scale(1)' }
			], { duration: 1000, easing: 'cubic-bezier(0.42, 0, 0.58, 1)' });
			
			// Big tick drawing animation
			const tick = svgRef.querySelector('path[d*="m9 11"]');
			if (tick) {
				const pathLength = tick.getTotalLength();
				tick.style.strokeDasharray = pathLength + ' ' + pathLength;
				tick.style.strokeDashoffset = pathLength;
				
				tick.animate([
					{ strokeDashoffset: pathLength, opacity: '1' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 800, easing: 'cubic-bezier(0.42, 0, 0.58, 1)', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const tick = svgRef.querySelector('path[d*="m9 11"]');
			if (tick) {
				tick.getAnimations().forEach(animation => animation.cancel());
				tick.style.strokeDasharray = '';
				tick.style.strokeDashoffset = '';
				tick.style.opacity = '1';
			}
			svgRef.style.transform = 'scale(1)';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): CircleCheckBigIconHandle {
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
		<path d="M21.801 10A10 10 0 1 1 17 3.335" />
		<path d="m9 11 3 3L22 4" />
	</svg>
</div>
