<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface HouseIconHandle {
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
			
			// Wiggle animation for house group
			const houseGroup = svgRef.querySelector('g:first-child');
			if (houseGroup) {
				houseGroup.animate([
					{ transform: 'rotate(0deg) scale(1)' },
					{ transform: 'rotate(-1.5deg) scale(1.02)' },
					{ transform: 'rotate(1.5deg) scale(1)' },
					{ transform: 'rotate(0deg) scale(1)' }
				], { duration: 600, easing: 'ease-in-out' });
			}
			
			// House outline drawing
			const housePath = svgRef.querySelector('path[d*="M3 10a2 2"]');
			if (housePath) {
				housePath.animate([
					{ strokeDashoffset: '100', opacity: '0.35' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 800, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Door animation (delay: 0.45)
			const doorPath = svgRef.querySelector('path[d*="M15 21v-8"]');
			if (doorPath) {
				doorPath.animate([
					{ transform: 'scaleY(0.6)', opacity: '0' },
					{ transform: 'scaleY(1.15)', opacity: '1' },
					{ transform: 'scaleY(1)', opacity: '1' }
				], { duration: 500, delay: 450, easing: 'ease-out' });
			}
			
			// Smoke animation (delay: 0.3)
			const smokeGroup = svgRef.querySelector('g:last-child');
			if (smokeGroup) {
				smokeGroup.animate([
					{ opacity: '0', transform: 'translateY(0px) scale(0.8)' },
					{ opacity: '0.7', transform: 'translateY(-6px) scale(1)' },
					{ opacity: '0', transform: 'translateY(-10px) scale(1.1)' }
				], { duration: 1100, delay: 300, easing: 'ease-in-out' });
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
				element.style.opacity = '1';
			});
			
			// Reset smoke group to invisible
			const smokeGroup = svgRef.querySelector('g:last-child');
			if (smokeGroup) {
				smokeGroup.style.opacity = '0';
			}
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): HouseIconHandle {
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
		class="lucide lucide-house-icon lucide-house"
	>
		<g style="transform-origin: center;">
			<path 
				d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
				stroke-dasharray="100" 
				stroke-dashoffset="100"
			/>
			<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" style="transform-origin: center;" />
		</g>
		
		<g style="opacity: 0; transform-origin: center;">
			<circle cx="16.5" cy="6" r="0.8" />
			<circle cx="17.5" cy="4.5" r="0.6" />
			<circle cx="18.3" cy="3.2" r="0.45" />
		</g>
	</svg>
</div>
