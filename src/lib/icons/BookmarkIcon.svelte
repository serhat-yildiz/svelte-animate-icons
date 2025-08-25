<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BookmarkIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let sparkRef: HTMLDivElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	// Animation controls
	function startAnimation() {
		if (svgRef && sparkRef) {
			isAnimating = true;
			
			// Bookmark scaling animation
			// React: scale: [1, 1.15, 0.9, 1]
			svgRef.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale(1.15)' },
				{ transform: 'scale(0.9)' },
				{ transform: 'scale(1)' }
			], {
				duration: 1200,
				iterations: Infinity,
				easing: 'ease-in-out'
			});
			
			// Spark effect animation
			// React: opacity: [0.8, 0, 0], scale: [1, 1.5, 0]
			const sparkSvg = sparkRef.querySelector('svg');
			if (sparkSvg) {
				sparkSvg.animate([
					{ opacity: '0.8', transform: 'scale(1)' },
					{ opacity: '0', transform: 'scale(1.5)' },
					{ opacity: '0', transform: 'scale(0)' }
				], {
					duration: 1200,
					iterations: Infinity,
					easing: 'ease-out'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef && sparkRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const sparkSvg = sparkRef.querySelector('svg');
			if (sparkSvg) {
				sparkSvg.getAnimations().forEach(animation => animation.cancel());
				sparkSvg.style.transform = 'scale(0)';
				sparkSvg.style.opacity = '0';
			}
			// Reset SVG transform
			svgRef.style.transform = 'scale(1)';
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
	export function getControls(): BookmarkIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx('relative inline-flex', className)}
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
		<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
	</svg>

	<div bind:this={sparkRef} class="absolute -top-1 right-0">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size / 3}
			height={size / 3}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			style="opacity: 0; transform: scale(0);"
		>
			<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
		</svg>
	</div>
</div>
