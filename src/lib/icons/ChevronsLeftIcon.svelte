<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ChevronsLeftIconHandle {
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
			const paths = svgRef.querySelectorAll('path');
			
			// Leading arrow
			if (paths[1]) {
				paths[1].animate([
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(-4px)', opacity: '0.6' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 800, iterations: Infinity });
			}
			
			// Trailing arrow with delay
			if (paths[0]) {
				paths[0].animate([
					{ transform: 'translateX(0px)', opacity: '0.5' },
					{ transform: 'translateX(-6px)', opacity: '0.2' },
					{ transform: 'translateX(0px)', opacity: '0.5' }
				], { duration: 800, delay: 200, iterations: Infinity });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const paths = svgRef.querySelectorAll('path');
			paths.forEach((path, index) => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.transform = 'translateX(0px)';
				path.style.opacity = index === 0 ? '0.5' : '1';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): ChevronsLeftIconHandle {
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
		<path d="m18 17-5-5 5-5" stroke="currentColor" style="opacity: 0.5;" />
		<path d="m11 17-5-5 5-5" stroke="currentColor" />
	</svg>
</div>
