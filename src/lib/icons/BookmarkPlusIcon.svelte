<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BookmarkPlusIconHandle {
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
			
			// Bookmark bounce animation
			// React: scale: [1, 1.08, 0.96, 1], y: [0, -2, 0]
			svgRef.animate([
				{ transform: 'scale(1) translateY(0px)' },
				{ transform: 'scale(1.08) translateY(-2px)' },
				{ transform: 'scale(0.96) translateY(0px)' },
				{ transform: 'scale(1) translateY(0px)' }
			], {
				duration: 1200,
				easing: 'ease-in-out'
			});
			
			// Plus cross scaling animation
			// React: scale: [1, 1.2, 0.9, 1], opacity: [1, 0.8, 1]
			const plusLines = svgRef.querySelectorAll('line');
			plusLines.forEach(line => {
				line.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.2)', opacity: '0.8' },
					{ transform: 'scale(0.9)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], {
					duration: 800,
					easing: 'ease-in-out'
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const plusLines = svgRef.querySelectorAll('line');
			plusLines.forEach(line => {
				line.getAnimations().forEach(animation => animation.cancel());
				line.style.transform = 'scale(1)';
				line.style.opacity = '1';
			});
			// Reset SVG transform
			svgRef.style.transform = 'scale(1) translateY(0px)';
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
	export function getControls(): BookmarkPlusIconHandle {
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
		<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
		<line x1="12" x2="12" y1="7" y2="13" style="transform-origin: center;" />
		<line x1="15" x2="9" y1="10" y2="10" style="transform-origin: center;" />
	</svg>
</div>
