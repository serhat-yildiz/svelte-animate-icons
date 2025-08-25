<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 32, class: className, ...restProps }: Props = $props();
	
	export interface CheckCheckIconHandle {
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
			
			// First check mark drawing animation
			// React: strokeDashoffset: [20, 0], scale: [1, 1.2, 1], opacity: [0.5, 1]
			const firstCheck = svgRef.querySelector('path[d="M18 6 7 17l-5-5"]');
			if (firstCheck) {
				firstCheck.animate([
					{ strokeDashoffset: '20', transform: 'scale(1)', opacity: '0.5' },
					{ strokeDashoffset: '10', transform: 'scale(1.2)', opacity: '0.75' },
					{ strokeDashoffset: '0', transform: 'scale(1)', opacity: '1' }
				], {
					duration: 700,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}
			
			// Second check mark slide-in animation (delay: 0.35)
			// React: opacity: [0, 1], x: [-6, 0]
			const secondCheck = svgRef.querySelector('path[d="m22 10-7.5 7.5L13 16"]');
			if (secondCheck) {
				secondCheck.animate([
					{ opacity: '0', transform: 'translateX(-6px)' },
					{ opacity: '1', transform: 'translateX(0px)' }
				], {
					duration: 500,
					delay: 350,
					easing: 'ease-out',
					fill: 'forwards'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			const allPaths = svgRef.querySelectorAll('path');
			allPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDashoffset = '0';
				path.style.transform = 'scale(1) translateX(0px)';
				path.style.opacity = '1';
			});
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
	export function getControls(): CheckCheckIconHandle {
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
			d="M18 6 7 17l-5-5" 
			stroke-dasharray="20" 
			stroke-dashoffset="0"
			style="transform-origin: center;"
		/>
		<path 
			d="m22 10-7.5 7.5L13 16" 
			stroke-dasharray="20" 
			stroke-dashoffset="0"
		/>
	</svg>
</div>
