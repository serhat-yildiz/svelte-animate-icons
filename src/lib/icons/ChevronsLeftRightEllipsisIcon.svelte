<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ChevronsLeftRightEllipsisIconHandle {
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
			
			// Dots animation with stagger
			const dots = [paths[0], paths[1], paths[2]];
			dots.forEach((dot, i) => {
				if (dot) {
					dot.animate([
						{ opacity: '0.3' },
						{ opacity: '1' },
						{ opacity: '0.3' }
					], { duration: 1000, delay: i * 300, iterations: Infinity });
				}
			});
			
			// Left arrow
			if (paths[3]) {
				paths[3].animate([
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(-4px)', opacity: '0.5' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 1000, iterations: Infinity });
			}
			
			// Right arrow with delay
			if (paths[4]) {
				paths[4].animate([
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(4px)', opacity: '0.5' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 1000, delay: 200, iterations: Infinity });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const paths = svgRef.querySelectorAll('path');
			paths.forEach((path, index) => {
				path.getAnimations().forEach(animation => animation.cancel());
				if (index < 3) {
					path.style.opacity = '0.3'; // dots
				} else {
					path.style.transform = 'translateX(0px)';
					path.style.opacity = '1'; // arrows
				}
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): ChevronsLeftRightEllipsisIconHandle {
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
		<path d="M8 12h.01" style="opacity: 0.3;" />
		<path d="M12 12h.01" style="opacity: 0.3;" />
		<path d="M16 12h.01" style="opacity: 0.3;" />
		<path d="m7 7-5 5 5 5" stroke="currentColor" />
		<path d="m17 7 5 5-5 5" stroke="currentColor" />
	</svg>
</div>
