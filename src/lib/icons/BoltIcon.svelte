<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BoltIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	// Animation controls
	function startAnimation() {
		if (svgRef) {
			isAnimating = true;
			
			// SVG scale and rotate animation
			// React: scale: [1, 1.08, 0.95, 1], rotate: [0, -2, 2, 0]
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg)' },
				{ transform: 'scale(1.08) rotate(-2deg)' },
				{ transform: 'scale(0.95) rotate(2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], {
				duration: 1200,
				iterations: Infinity,
				easing: 'ease-in-out'
			});
			
			// Path drawing animation
			// React: pathLength: [0, 1]
			const path = svgRef.querySelector('path');
			if (path) {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength },
					{ strokeDashoffset: 0 }
				], {
					duration: 1300,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			}
			
			// Circle scaling and opacity animation
			// React: scale: [1, 1.3, 0.9, 1], opacity: [1, 0.6, 1]
			const circle = svgRef.querySelector('circle');
			if (circle) {
				circle.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.3)', opacity: '0.6' },
					{ transform: 'scale(0.9)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], {
					duration: 1100,
					iterations: Infinity,
					easing: 'ease-in-out'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				// Reset styles
				element.style.transform = '';
				element.style.strokeDasharray = '';
				element.style.strokeDashoffset = '';
				element.style.opacity = '1';
			});
			// Reset SVG transform
			svgRef.style.transform = 'scale(1) rotate(0deg)';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (!isControlled) {
			stopAnimation();
		}
	}
	
	// Public API
	export function getControls(): BoltIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
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
		<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
		<circle cx="12" cy="12" r="4" style="transform-origin: center;" />
	</svg>
</div>
