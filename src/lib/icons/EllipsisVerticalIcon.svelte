<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface EllipsisVerticalIconHandle {
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
			
			// Vertical dots animation with stagger
			const circles = svgRef.querySelectorAll('circle');
			circles.forEach((circle, i) => {
				circle.animate([
					{ transform: 'translateY(-3px)', opacity: '0.4' },
					{ transform: 'translateY(0px)', opacity: '1' },
					{ transform: 'translateY(-3px)', opacity: '0.4' }
				], { 
					duration: 800, 
					delay: i * 200, 
					iterations: Infinity 
				});
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const circles = svgRef.querySelectorAll('circle');
			circles.forEach(circle => {
				circle.getAnimations().forEach(animation => animation.cancel());
				circle.style.transform = '';
				circle.style.opacity = '0.7';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): EllipsisVerticalIconHandle {
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
	>
		<circle cx="12" cy="12" r="1" style="opacity: 0.7;" />
		<circle cx="12" cy="5" r="1" style="opacity: 0.7;" />
		<circle cx="12" cy="19" r="1" style="opacity: 0.7;" />
	</svg>
</div>
