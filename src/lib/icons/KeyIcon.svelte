<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface KeyIconHandle {
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
			
			// Group sequence animation
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'scale(1) rotate(0deg) translateX(0px) translateY(0px)' },
					{ transform: 'scale(1.01) rotate(-6deg) translateX(0px) translateY(0px)' },
					{ transform: 'scale(1.01) rotate(0deg) translateX(0px) translateY(0px)' },
					{ transform: 'scale(1) rotate(6deg) translateX(0px) translateY(0px)' },
					{ transform: 'scale(1) rotate(0deg) translateX(0px) translateY(0px)' }
				], { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
			}
			
			// Ring lock animation
			const circle = svgRef.querySelector('circle');
			if (circle) {
				circle.animate([
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(0.98)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' },
					{ transform: 'scale(1.02)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
			}
			
			// Shaft slide animation
			const shaft = svgRef.querySelector('path[d*="m21 2"]');
			if (shaft) {
				shaft.animate([
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(-0.6px)', opacity: '1' },
					{ transform: 'translateX(0px)', opacity: '1' },
					{ transform: 'translateX(0.6px)', opacity: '1' },
					{ transform: 'translateX(0px)', opacity: '1' }
				], { duration: 900, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
			}
			
			// Head turn animation (delay: 0.04)
			const head = svgRef.querySelector('path[d*="m15.5 7.5"]');
			if (head) {
				head.animate([
					{ transform: 'rotate(0deg) translateX(0px) translateY(0px)' },
					{ transform: 'rotate(-18deg) translateX(-1px) translateY(-0.4px)' },
					{ transform: 'rotate(0deg) translateX(0px) translateY(0px)' },
					{ transform: 'rotate(18deg) translateX(1px) translateY(0.4px)' },
					{ transform: 'rotate(0deg) translateX(0px) translateY(0px)' }
				], { 
					duration: 900, 
					delay: 40, 
					easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
					transformOrigin: '19px 6px'
				});
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
	
	export function getControls(): KeyIconHandle {
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
		class="lucide lucide-key-icon lucide-key"
	>
		<g style="transform-origin: center;">
			<circle cx="7.5" cy="15.5" r="5.5" style="transform-origin: center;" />
			<path d="m21 2-9.6 9.6" />
			<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
		</g>
	</svg>
</div>
