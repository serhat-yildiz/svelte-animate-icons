<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CodeIconHandle {
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
			
			// Group scale and rotate
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'scale(1) rotate(0deg)' },
					{ transform: 'scale(1.03) rotate(-0.5deg)' },
					{ transform: 'scale(1) rotate(0deg)' }
				], { duration: 800, easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)' });
			}
			
			// Right chevron drawing (delay: 0.12)
			const rightPath = svgRef.querySelector('path[d*="m16 18"]');
			if (rightPath) {
				rightPath.animate([
					{ strokeDashoffset: '32' },
					{ strokeDashoffset: '0' }
				], { duration: 1100, delay: 120, easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)', fill: 'forwards' });
			}
			
			// Left chevron drawing (delay: 0.28)
			const leftPath = svgRef.querySelector('path[d*="m8 6"]');
			if (leftPath) {
				leftPath.animate([
					{ strokeDashoffset: '32' },
					{ strokeDashoffset: '0' }
				], { duration: 1100, delay: 280, easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				element.style.transform = '';
				element.style.strokeDashoffset = '';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): CodeIconHandle {
		isControlled = true;
		return { startAnimation, stopAnimation };
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
		class="lucide lucide-code-icon lucide-code"
	>
		<g style="transform-origin: center;">
			<path d="m16 18 6-6-6-6" stroke-dasharray="32" stroke-dashoffset="32" />
			<path d="m8 6-6 6 6 6" stroke-dasharray="32" stroke-dashoffset="32" />
		</g>
	</svg>
</div>
