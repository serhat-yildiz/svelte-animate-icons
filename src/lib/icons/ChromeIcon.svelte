<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ChromeIconHandle {
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
			
			// Outer circle rotation
			const outerCircle = svgRef.querySelector('circle[r="10"]');
			if (outerCircle) {
				outerCircle.animate([
					{ transform: 'rotate(0deg)' },
					{ transform: 'rotate(360deg)' }
				], { duration: 4000, iterations: Infinity, easing: 'linear' });
			}
			
			// Inner circle scale pulse
			const innerCircle = svgRef.querySelector('circle[r="4"]');
			if (innerCircle) {
				innerCircle.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.2)', opacity: '0.7' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 1500, iterations: Infinity });
			}
			
			// Lines opacity animation with stagger
			const lines = svgRef.querySelectorAll('line');
			lines.forEach((line, i) => {
				line.animate([
					{ opacity: '0.8' },
					{ opacity: '0.3' },
					{ opacity: '0.8' }
				], { duration: 1200, delay: i * 300, iterations: Infinity });
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
	
	export function getControls(): ChromeIconHandle {
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
		<circle cx="12" cy="12" r="4" stroke="currentColor" style="transform-origin: center;" />
		<line x1="21.17" y1="8" x2="12" y2="8" stroke="currentColor" style="opacity: 0.8;" />
		<line x1="3.95" y1="6.06" x2="8.54" y2="14" stroke="currentColor" style="opacity: 0.8;" />
		<line x1="10.88" y1="21.94" x2="15.46" y2="14" stroke="currentColor" style="opacity: 0.8;" />
	</svg>
</div>
