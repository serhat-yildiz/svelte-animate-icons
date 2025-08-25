<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface DashboardIconHandle {
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
			
			// Icon scale and rotate
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg)' },
				{ transform: 'scale(1.05) rotate(-2deg)' },
				{ transform: 'scale(0.95) rotate(2deg)' },
				{ transform: 'scale(1) rotate(0deg)' }
			], { duration: 1300, easing: 'ease-in-out', iterations: Infinity });
			
			// Tiles animation with stagger
			const tiles = svgRef.querySelectorAll('rect');
			tiles.forEach((tile, i) => {
				tile.animate([
					{ opacity: '0.5', transform: 'scale(0.9) translateY(2px)' },
					{ opacity: '1', transform: 'scale(1.1) translateY(-2px)' },
					{ opacity: '0.8', transform: 'scale(1) translateY(0px)' },
					{ opacity: '1', transform: 'scale(1) translateY(0px)' }
				], { 
					duration: 1200, 
					delay: i * 200, 
					easing: 'ease-in-out', 
					iterations: Infinity 
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const tiles = svgRef.querySelectorAll('rect');
			tiles.forEach(tile => {
				tile.getAnimations().forEach(animation => animation.cancel());
				tile.style.transform = '';
				tile.style.opacity = '1';
			});
			svgRef.style.transform = '';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): DashboardIconHandle {
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
		style="transform-origin: center;"
	>
		<rect width="7" height="9" x="3" y="3" rx="1" style="transform-origin: center;" />
		<rect width="7" height="5" x="14" y="3" rx="1" style="transform-origin: center;" />
		<rect width="7" height="9" x="14" y="12" rx="1" style="transform-origin: center;" />
		<rect width="7" height="5" x="3" y="16" rx="1" style="transform-origin: center;" />
	</svg>
</div>
