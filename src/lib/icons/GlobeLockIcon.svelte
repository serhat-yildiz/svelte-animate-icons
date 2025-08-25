<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface GlobeLockIconHandle {
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
			
			// Lock elements animation
			const lockElements = svgRef.querySelectorAll('path[d*="M20 6V4"], rect');
			lockElements.forEach(element => {
				element.animate([
					{ transform: 'rotate(0deg) translateX(0px)', opacity: '1' },
					{ transform: 'rotate(-8deg) translateX(-2px)', opacity: '1' },
					{ transform: 'rotate(8deg) translateX(2px)', opacity: '1' },
					{ transform: 'rotate(-5deg) translateX(-1px)', opacity: '1' },
					{ transform: 'rotate(5deg) translateX(1px)', opacity: '1' },
					{ transform: 'rotate(0deg) translateX(0px)', opacity: '1' }
				], { duration: 800, easing: 'ease-in-out' });
			});
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const lockElements = svgRef.querySelectorAll('path[d*="M20 6V4"], rect');
			lockElements.forEach(element => {
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
	
	export function getControls(): GlobeLockIconHandle {
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
		<path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" />
		<path d="M2 12h8.5" />
		<path d="M20 6V4a2 2 0 1 0-4 0v2" style="transform-origin: center;" />
		<rect width="8" height="5" x="14" y="6" rx="1" style="transform-origin: center;" />
	</svg>
</div>
