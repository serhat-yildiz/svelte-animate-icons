<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface ContactRoundIconHandle {
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
			
			// Rectangle drawing
			const rect = svgRef.querySelector('rect');
			if (rect) {
				rect.animate([
					{ strokeDashoffset: '100', opacity: '0.3' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 800, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Circle animation (delay: 0.3)
			const circle = svgRef.querySelector('circle');
			if (circle) {
				circle.animate([
					{ transform: 'scale(0.5)', opacity: '0' },
					{ transform: 'scale(1.2)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 600, delay: 300, easing: 'ease-out' });
			}
			
			// Curve animation (delay: 0.5)
			const curve = svgRef.querySelector('path[d*="M17.915 22"]');
			if (curve) {
				curve.animate([
					{ strokeDashoffset: '30', opacity: '0' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 600, delay: 500, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Lines animation (delay: 0.6)
			const lines = svgRef.querySelectorAll('path[d*="v2"]');
			lines.forEach(line => {
				line.animate([
					{ transform: 'translateX(-10px)', opacity: '0' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 400, delay: 600, easing: 'ease-out' });
			});
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
				element.style.opacity = '1';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): ContactRoundIconHandle {
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
		class="lucide lucide-contact-round-icon lucide-contact-round"
	>
		<path d="M16 2v2" />
		<path d="M17.915 22a6 6 0 0 0-12 0" stroke-dasharray="30" stroke-dashoffset="30" />
		<path d="M8 2v2" />
		<circle cx="12" cy="12" r="4" style="transform-origin: center;" />
		<rect x="3" y="4" width="18" height="18" rx="2" stroke-dasharray="100" stroke-dashoffset="100" />
	</svg>
</div>
