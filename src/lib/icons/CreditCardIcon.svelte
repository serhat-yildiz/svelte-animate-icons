<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CreditCardIconHandle {
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
			
			// Card tilt animation
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'rotate(0deg) scale(1) translateX(0px) translateY(0px)' },
					{ transform: 'rotate(-4deg) scale(1.02) translateX(-0.4px) translateY(-0.3px)' },
					{ transform: 'rotate(2deg) scale(1) translateX(0px) translateY(0px)' },
					{ transform: 'rotate(0deg) scale(1) translateX(0px) translateY(0px)' }
				], { duration: 600, easing: 'ease-in-out' });
			}
			
			// Stripe slide (delay: 0.08)
			const stripe = svgRef.querySelector('line');
			if (stripe) {
				stripe.animate([
					{ transform: 'translateX(-2px)', opacity: '0.7' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 400, delay: 80, easing: 'ease-out' });
			}
			
			// Swipe line (delay: 0.18)
			const swipeLine = svgRef.querySelector('path[d*="M5 15"]');
			if (swipeLine) {
				const pathLength = swipeLine.getTotalLength();
				swipeLine.style.strokeDasharray = pathLength + ' ' + pathLength;
				swipeLine.style.strokeDashoffset = pathLength;
				
				swipeLine.animate([
					{ strokeDashoffset: pathLength, opacity: '0' },
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: 0, opacity: '0.9' }
				], { duration: 500, delay: 180, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Emboss pulse (delay: 0.3)
			const rect = svgRef.querySelector('rect');
			if (rect) {
				rect.animate([
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.035)' },
					{ transform: 'scale(1)' }
				], { duration: 280, delay: 300, easing: 'ease-out' });
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
				element.style.strokeDasharray = '';
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
	
	export function getControls(): CreditCardIconHandle {
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
		class="lucide lucide-credit-card-icon lucide-credit-card"
	>
		<g style="transform-origin: center;">
			<rect width="20" height="14" x="2" y="5" rx="2" style="transform-origin: center;" />
			<line x1="2" x2="22" y1="10" y2="10" />
			<path d="M5 15 H15" stroke="currentColor" stroke-width="1.5" />
		</g>
	</svg>
</div>
