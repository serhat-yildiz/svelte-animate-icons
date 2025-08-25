<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface CloudUploadIconHandle {
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
			
			// Group pulse
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.02)' },
					{ transform: 'scale(1)' }
				], { duration: 600, easing: 'ease-in-out' });
			}
			
			// Cloud drawing
			const cloud = svgRef.querySelector('path[d*="M4 14.899"]');
			if (cloud) {
				cloud.animate([
					{ strokeDashoffset: '100', opacity: '0.4' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Shaft drawing (delay: 0.05)
			const shaft = svgRef.querySelector('path[d*="M12 13v8"]');
			if (shaft) {
				shaft.animate([
					{ strokeDashoffset: '30', opacity: '0.5' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 550, delay: 50, easing: 'ease-in-out', fill: 'forwards' });
			}
			
			// Arrow head animation (delay: 0.1)
			const head = svgRef.querySelector('path[d*="m8 17"]');
			if (head) {
				head.animate([
					{ transform: 'translateY(2px) scale(1)', opacity: '0.7' },
					{ transform: 'translateY(-2px) scale(1.06)', opacity: '1' },
					{ transform: 'translateY(0px) scale(1)', opacity: '1' }
				], { duration: 600, delay: 100, easing: 'ease-in-out' });
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
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) startAnimation();
	}
	
	function handleMouseLeave() {
		if (!isControlled) stopAnimation();
	}
	
	export function getControls(): CloudUploadIconHandle {
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
		class="lucide lucide-cloud-upload-icon lucide-cloud-upload"
	>
		<g style="transform-origin: center;">
			<path 
				d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" 
				stroke-dasharray="100" 
				stroke-dashoffset="100"
			/>
			<path 
				d="M12 13v8" 
				stroke-dasharray="30" 
				stroke-dashoffset="30"
			/>
			<path d="m8 17 4-4 4 4" style="transform-origin: center;" />
		</g>
	</svg>
</div>
