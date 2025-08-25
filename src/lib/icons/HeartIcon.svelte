<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface HeartIconHandle {
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
			
			// Left path drawing
			const leftPath = svgRef.querySelector('path[d*="M2 9.5a5.5"]');
			if (leftPath) {
				const pathLength = leftPath.getTotalLength();
				leftPath.style.strokeDasharray = pathLength + ' ' + pathLength;
				leftPath.style.strokeDashoffset = pathLength;
				
				leftPath.animate([
					{ strokeDashoffset: pathLength },
					{ strokeDashoffset: 0 }
				], { duration: 400, easing: 'cubic-bezier(0.42, 0, 0.58, 1)', fill: 'forwards' });
			}
			
			// Right path drawing (delay: 0.2)
			const rightPath = svgRef.querySelector('path[d*="M12.409 5.824"]');
			if (rightPath) {
				const pathLength = rightPath.getTotalLength();
				rightPath.style.strokeDasharray = pathLength + ' ' + pathLength;
				rightPath.style.strokeDashoffset = pathLength;
				
				rightPath.animate([
					{ strokeDashoffset: pathLength },
					{ strokeDashoffset: 0 }
				], { duration: 400, delay: 200, easing: 'cubic-bezier(0.42, 0, 0.58, 1)', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): HeartIconHandle {
		isControlled = true;
		return { startAnimation, stopAnimation };
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
		<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676" />
		<path d="M12.409 5.824A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
	</svg>
</div>