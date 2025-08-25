<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BrainIconHandle {
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
			
			// Group micro tilt
			// React: rotate: [0, -2.2, 1.2, 0], scale: [1, 1.015, 1]
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'rotate(0deg) scale(1)' },
					{ transform: 'rotate(-2.2deg) scale(1.015)' },
					{ transform: 'rotate(1.2deg) scale(1)' },
					{ transform: 'rotate(0deg) scale(1)' }
				], {
					duration: 700,
					easing: 'ease-in-out'
				});
			}
			
			// Spine pulse animation (delay: 0.06)
			// React: pathLength: [0, 1], opacity: [0.55, 1]
			const spine = svgRef.querySelector('path[d="M12 18V5"]');
			if (spine) {
				const pathLength = spine.getTotalLength();
				spine.style.strokeDasharray = pathLength + ' ' + pathLength;
				spine.style.strokeDashoffset = pathLength;
				
				spine.animate([
					{ strokeDashoffset: pathLength, opacity: '0.55' },
					{ strokeDashoffset: 0, opacity: '1' }
				], {
					duration: 500,
					delay: 60,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}
			
			// Lobe breathe A paths (delay: 0.12)
			// React: pathLength: [0, 1], opacity: [0.6, 1], scale: [0.98, 1.02, 1]
			const lobePathsA = svgRef.querySelectorAll('path[d*="M15 13a4.17"], path[d*="M17.997 5.125"], path[d*="M19.967 17.483"], path[d*="M6.003 5.125"]');
			lobePathsA.forEach(path => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6', transform: 'scale(0.98)' },
					{ strokeDashoffset: pathLength * 0.5, opacity: '0.8', transform: 'scale(1.02)' },
					{ strokeDashoffset: 0, opacity: '1', transform: 'scale(1)' }
				], {
					duration: 600,
					delay: 120,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			});
			
			// Lobe breathe B paths (delay: 0.18)
			// React: pathLength: [0, 1], opacity: [0.6, 1], scale: [1.02, 0.98, 1]
			const lobePathsB = svgRef.querySelectorAll('path[d*="M17.598 6.5"], path[d*="M18 18a4"], path[d*="M6 18a4"]');
			lobePathsB.forEach(path => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6', transform: 'scale(1.02)' },
					{ strokeDashoffset: pathLength * 0.5, opacity: '0.8', transform: 'scale(0.98)' },
					{ strokeDashoffset: 0, opacity: '1', transform: 'scale(1)' }
				], {
					duration: 620,
					delay: 180,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			});
			
			// Synapse spark L (delay: 0.26)
			// React: pathLength: [0, 1], opacity: [0, 1, 0]
			const sparkL = svgRef.querySelector('path[d*="M8.5 11.6"]');
			if (sparkL) {
				const pathLength = sparkL.getTotalLength();
				sparkL.style.strokeDasharray = pathLength + ' ' + pathLength;
				sparkL.style.strokeDashoffset = pathLength;
				
				sparkL.animate([
					{ strokeDashoffset: pathLength, opacity: '0' },
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: -pathLength * 0.5, opacity: '0' }
				], {
					duration: 550,
					delay: 260,
					easing: 'ease-in-out'
				});
			}
			
			// Synapse spark R (delay: 0.34)
			// React: pathLength: [0, 1], opacity: [0, 1, 0]
			const sparkR = svgRef.querySelector('path[d*="M13.8 9.4"]');
			if (sparkR) {
				const pathLength = sparkR.getTotalLength();
				sparkR.style.strokeDasharray = pathLength + ' ' + pathLength;
				sparkR.style.strokeDashoffset = pathLength;
				
				sparkR.animate([
					{ strokeDashoffset: pathLength, opacity: '0' },
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: -pathLength * 0.5, opacity: '0' }
				], {
					duration: 550,
					delay: 340,
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
	export function getControls(): BrainIconHandle {
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
		class="lucide lucide-brain-icon lucide-brain"
	>
		<g style="transform-origin: center;">
			<path d="M12 18V5" />
			<path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" style="transform-origin: center;" />
			<path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" style="transform-origin: center;" />
			<path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" style="transform-origin: center;" />
			<path d="M18 18a4 4 0 0 0 2-7.464" style="transform-origin: center;" />
			<path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" style="transform-origin: center;" />
			<path d="M6 18a4 4 0 0 1-2-7.464" style="transform-origin: center;" />
			<path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" style="transform-origin: center;" />
			<path d="M8.5 11.6 10.2 10.4" stroke="currentColor" stroke-width="1.4" />
			<path d="M13.8 9.4 15.6 10.7" stroke="currentColor" stroke-width="1.4" />
		</g>
	</svg>
</div>
