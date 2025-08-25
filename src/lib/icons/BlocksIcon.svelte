<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 32, class: className, ...restProps }: Props = $props();
	
	export interface BlocksIconHandle {
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
			
			// SVG rotation and scale animation
			// React: rotate: [0, -2, 2, 0], scale: [1, 1.05, 0.95, 1]
			svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(-2deg) scale(1.05)' },
				{ transform: 'rotate(2deg) scale(0.95)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], {
				duration: 1600,
				iterations: Infinity,
				easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
			});
			
			// Path drawing animation
			// React: pathLength: [0, 1], opacity: [0.5, 1]
			const path = svgRef.querySelector('path');
			if (path) {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.5' },
					{ strokeDashoffset: 0, opacity: '1' }
				], {
					duration: 1400,
					iterations: Infinity,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
			}
			
			// Rect scaling animation
			// React: scale: [1, 1.2, 0.9, 1]
			const rect = svgRef.querySelector('rect');
			if (rect) {
				rect.animate([
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.2)' },
					{ transform: 'scale(0.9)' },
					{ transform: 'scale(1)' }
				], {
					duration: 1200,
					iterations: Infinity,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
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
			svgRef.style.transform = 'rotate(0deg) scale(1)';
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
	export function getControls(): BlocksIconHandle {
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
		<path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" />
		<rect x="14" y="2" width="8" height="8" rx="1" style="transform-origin: center;" />
	</svg>
</div>
