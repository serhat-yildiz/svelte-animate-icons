<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BellRingIcon {
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
			// Bell swing animation
			svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(15deg)' },
				{ transform: 'rotate(-10deg)' },
				{ transform: 'rotate(5deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: 600,
				easing: 'ease-in-out'
			});
			
			// Ring lines animation
			const ringPaths = svgRef.querySelectorAll('path');
			if (ringPaths.length > 1) {
				ringPaths[1].animate([
					{ opacity: '0.5', transform: 'scale(1)' },
					{ opacity: '1', transform: 'scale(1.1)' },
					{ opacity: '0.5', transform: 'scale(1)' }
				], {
					duration: 400,
					delay: 100
				});
				
				if (ringPaths[3]) {
					ringPaths[3].animate([
						{ opacity: '0.5', transform: 'scale(1)' },
						{ opacity: '1', transform: 'scale(1.1)' },
						{ opacity: '0.5', transform: 'scale(1)' }
					], {
						duration: 400,
						delay: 150
					});
				}
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				// Reset stroke properties
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
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
	export function getControls(): BellRingIcon {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx(className)}
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
		<path d="M10.268 21a2 2 0 0 0 3.464 0" />
		<path d="M22 8c0-2.3-.8-4.3-2-6" />
		<path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
		<path d="M4 2C2.8 3.7 2 5.7 2 8" />
	</svg>
</div>