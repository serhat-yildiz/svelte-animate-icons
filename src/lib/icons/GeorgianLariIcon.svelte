<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface GeorgianLariIconHandle {
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
			
			// SVG animation
			svgRef.animate([
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
				{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
				{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
			], { duration: 1200, easing: 'ease-in-out' });
			
			// Arc stroke (delay: 0.06)
			const arcPath = svgRef.querySelector('path[d*="M11.5 21"]:not([opacity])');
			if (arcPath) {
				const pathLength = arcPath.getTotalLength();
				arcPath.style.strokeDasharray = pathLength + ' ' + pathLength;
				arcPath.style.strokeDashoffset = pathLength;
				
				arcPath.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 600, delay: 60, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Left vertical (delay: 0.16)
			const leftVert = svgRef.querySelector('path[d*="M9 12V3"]:not([opacity])');
			if (leftVert) {
				const pathLength = leftVert.getTotalLength();
				leftVert.style.strokeDasharray = pathLength + ' ' + pathLength;
				leftVert.style.strokeDashoffset = pathLength;
				
				leftVert.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 550, delay: 160, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Right vertical (delay: 0.26)
			const rightVert = svgRef.querySelector('path[d*="M13 12V3"]:not([opacity])');
			if (rightVert) {
				const pathLength = rightVert.getTotalLength();
				rightVert.style.strokeDasharray = pathLength + ' ' + pathLength;
				rightVert.style.strokeDashoffset = pathLength;
				
				rightVert.animate([
					{ strokeDashoffset: pathLength, opacity: '0.8' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 550, delay: 260, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Base stroke (delay: 0.36)
			const basePath = svgRef.querySelector('path[d*="M4 21h16"]:not([opacity])');
			if (basePath) {
				const pathLength = basePath.getTotalLength();
				basePath.style.strokeDasharray = pathLength + ' ' + pathLength;
				basePath.style.strokeDashoffset = pathLength;
				
				basePath.animate([
					{ strokeDashoffset: pathLength, opacity: '0.8' },
					{ strokeDashoffset: 0, opacity: '1' }
				], { duration: 550, delay: 360, easing: 'ease-in-out', fill: 'forwards' });
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const animatedPaths = svgRef.querySelectorAll('path:not([opacity])');
			animatedPaths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
				path.style.strokeDasharray = '';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
			});
			svgRef.style.transform = '';
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): GeorgianLariIconHandle {
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
		style="transform-origin: center;"
		class="lucide lucide-georgian-lari-icon lucide-georgian-lari"
	>
		<g opacity="0.35">
			<path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
			<path d="M13 12V3" />
			<path d="M4 21h16" />
			<path d="M9 12V3" />
		</g>
		
		<path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
		<path d="M9 12V3" />
		<path d="M13 12V3" />
		<path d="M4 21h16" />
	</svg>
</div>
