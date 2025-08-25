<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CirclePlusIconHandle {
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
			
			// Circle scale and rotation
			const circle = svgRef.querySelector('circle');
			if (circle) {
				circle.animate([
					{ transform: 'scale(1) rotate(0deg)' },
					{ transform: 'scale(1.1) rotate(180deg)' },
					{ transform: 'scale(1) rotate(360deg)' }
				], { duration: 2000, iterations: Infinity, easing: 'linear' });
			}
			
			// Plus lines opacity pulse
			const plusLines = svgRef.querySelectorAll('path');
			plusLines.forEach(line => {
				line.animate([
					{ opacity: '1' },
					{ opacity: '0.4' },
					{ opacity: '1' }
				], { duration: 1000, iterations: Infinity });
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				element.style.transform = '';
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
	
	export function getControls(): CirclePlusIconHandle {
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
		<circle cx="12" cy="12" r="10" stroke="currentColor" style="transform-origin: center;" />
		<path d="M8 12h8" stroke="currentColor" />
		<path d="M12 8v8" stroke="currentColor" />
	</svg>
</div>
