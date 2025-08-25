<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 32, class: className, ...restProps }: Props = $props();
	
	export interface CheckIconHandle {
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
			
			// Check mark drawing animation
			// React: strokeDashoffset: [20, 0], scale: [1, 1.2, 1], opacity: [0.5, 1]
			const checkPath = svgRef.querySelector('path');
			if (checkPath) {
				checkPath.animate([
					{ strokeDashoffset: '20', transform: 'scale(1)', opacity: '0.5' },
					{ strokeDashoffset: '10', transform: 'scale(1.2)', opacity: '0.75' },
					{ strokeDashoffset: '0', transform: 'scale(1)', opacity: '1' }
				], {
					duration: 600,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			const checkPath = svgRef.querySelector('path');
			if (checkPath) {
				checkPath.getAnimations().forEach(animation => animation.cancel());
				checkPath.style.strokeDashoffset = '0';
				checkPath.style.transform = 'scale(1)';
				checkPath.style.opacity = '1';
			}
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
	export function getControls(): CheckIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx('inline-flex items-center justify-center', className)}
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
		<path 
			d="M5 13l4 4L19 7" 
			stroke-dasharray="20" 
			stroke-dashoffset="0"
			style="transform-origin: center;"
		/>
	</svg>
</div>
