<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 32, class: className, ...restProps }: Props = $props();
	
	export interface BatteryIconHandle {
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
			
			// Battery warning animation
			// SVG shake: rotate: [0, -3, 3, -2, 0]
			svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(-3deg)' },
				{ transform: 'rotate(3deg)' },
				{ transform: 'rotate(-2deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: 500,
				iterations: Infinity,
				easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
			});
			
			// Battery rect color and opacity animation
			const rect = svgRef.querySelector('rect');
			if (rect) {
				rect.animate([
					{ stroke: '#ef4444', opacity: '0.6' },
					{ stroke: '#dc2626', opacity: '1' },
					{ stroke: '#ef4444', opacity: '0.6' }
				], {
					duration: 900,
					iterations: Infinity,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
			}
			
			// Battery tip color and opacity animation
			const tip = svgRef.querySelector('path');
			if (tip) {
				tip.animate([
					{ stroke: '#ef4444', opacity: '0.4' },
					{ stroke: '#dc2626', opacity: '1' },
					{ stroke: '#ef4444', opacity: '0.4' }
				], {
					duration: 700,
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
			const rect = svgRef.querySelector('rect');
			const tip = svgRef.querySelector('path');
			
			// Reset to normal state
			svgRef.style.transform = 'rotate(0deg)';
			if (rect) {
				rect.style.stroke = 'currentColor';
				rect.style.opacity = '1';
				rect.getAnimations().forEach(animation => animation.cancel());
			}
			if (tip) {
				tip.style.stroke = 'currentColor';
				tip.style.opacity = '1';
				tip.getAnimations().forEach(animation => animation.cancel());
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
	export function getControls(): BatteryIconHandle {
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
		<path d="M22 14L22 10" />
		<rect x="2" y="6" width="16" height="12" rx="2" />
	</svg>
</div>