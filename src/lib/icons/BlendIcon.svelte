<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BlendIconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let isControlled = false;
	
	// Animation controls
	function startAnimation() {
		if (svgRef) {
			isAnimating = true;
			
			// Group rotation and scale
			// React: rotate: [0, -1.5, 1.5, 0], scale: [1, 1.02, 1]
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'rotate(0deg) scale(1)' },
					{ transform: 'rotate(-1.5deg) scale(1.02)' },
					{ transform: 'rotate(1.5deg) scale(1)' },
					{ transform: 'rotate(0deg) scale(1)' }
				], {
					duration: 700,
					easing: 'ease-in-out'
				});
			}
			
			// Left circle (cx="9") stroke drawing and movement
			// React: strokeDashoffset: [48, 0], opacity: [0.45, 1], x: [0, 2, 4]
			const leftCircle = svgRef.querySelector('circle[cx="9"]');
			if (leftCircle) {
				leftCircle.animate([
					{ strokeDashoffset: '48', opacity: '0.45', transform: 'translateX(0px)' },
					{ strokeDashoffset: '24', opacity: '0.7', transform: 'translateX(2px)' },
					{ strokeDashoffset: '0', opacity: '1', transform: 'translateX(4px)' }
				], {
					duration: 600,
					easing: 'ease-in-out'
				});
			}
			
			// Right circle (cx="15") stroke drawing and movement with delay
			// React: strokeDashoffset: [48, 0], opacity: [0.45, 1], x: [0, -2, -4], delay: 0.06
			const rightCircle = svgRef.querySelector('circle[cx="15"]');
			if (rightCircle) {
				rightCircle.animate([
					{ strokeDashoffset: '48', opacity: '0.45', transform: 'translateX(0px)' },
					{ strokeDashoffset: '24', opacity: '0.7', transform: 'translateX(-2px)' },
					{ strokeDashoffset: '0', opacity: '1', transform: 'translateX(-4px)' }
				], {
					duration: 600,
					delay: 60,
					easing: 'ease-in-out'
				});
			}
			
			// Overlap pulse animation for the container of right circle
			// React: scale: [1, 1.06, 1], opacity: [0.9, 1, 1], delay: 0.18
			const overlapGroup = svgRef.querySelector('g g'); // nested g for overlap
			if (overlapGroup) {
				overlapGroup.animate([
					{ transform: 'scale(1)', opacity: '0.9' },
					{ transform: 'scale(1.06)', opacity: '1' },
					{ transform: 'scale(1)', opacity: '1' }
				], {
					duration: 500,
					delay: 180,
					easing: 'ease-in-out'
				});
			}
		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			// Cancel all animations
			svgRef.getAnimations().forEach(animation => animation.cancel());
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.getAnimations().forEach(animation => animation.cancel());
				// Reset styles
				element.style.transform = '';
				element.style.strokeDashoffset = '0';
				element.style.opacity = '1';
			});
		}
	}
	
	function handleMouseEnter() {
		if (!isControlled) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (!isControlled) {
			stopAnimation();
		}
	}
	
	// Public API
	export function getControls(): BlendIconHandle {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
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
		class="lucide lucide-blend-icon lucide-blend"
	>
		<g style="transform-origin: center;">
			<circle 
				cx="9" 
				cy="9" 
				r="7" 
				stroke-dasharray="48" 
				stroke-dashoffset="48"
			/>
			<g style="transform-origin: center;">
				<circle 
					cx="15" 
					cy="15" 
					r="7" 
					stroke-dasharray="48" 
					stroke-dashoffset="48"
				/>
			</g>
		</g>
	</svg>
</div>
