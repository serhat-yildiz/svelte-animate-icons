<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface BitcoinIconHandle {
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
			
			// Group sway animation
			// React: scale: [1, 1.055, 1], rotate: [0, -2, 2, 0], y: [0, -1, 0]
			const group = svgRef.querySelector('g');
			if (group) {
				group.animate([
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
					{ transform: 'scale(1.055) rotate(-2deg) translateY(-1px)' },
					{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
				], {
					duration: 900,
					easing: 'ease-in-out'
				});
			}
			
			// Path drawing animations with different delays and durations
			const pathAnimations = [
				{ selector: 'path[d*="M11.767 19.089c4.924"]', delay: 60, duration: 550 },
				{ selector: 'path[d*="M10.551 19.089L5.86"]', delay: 120, duration: 450 },
				{ selector: 'path[d*="M10.551 19.089l-.347"]', delay: 180, duration: 400 },
				{ selector: 'path[d*="M12.114 12.195c4.924"]', delay: 260, duration: 600 },
				{ selector: 'path[d*="M12.114 12.195l-3.94"]', delay: 320, duration: 450 },
				{ selector: 'path[d*="M13.329 5.301L8.29"]', delay: 400, duration: 450 },
				{ selector: 'path[d*="M14.198 5.302l.348"]', delay: 460, duration: 400 },
				{ selector: 'path[d*="M7.48 20.364l3.126"]', delay: 540, duration: 750 }
			];
			
			pathAnimations.forEach(({ selector, delay, duration }) => {
				const path = svgRef.querySelector(selector);
				if (path) {
					const pathLength = path.getTotalLength();
					path.style.strokeDasharray = pathLength + ' ' + pathLength;
					path.style.strokeDashoffset = pathLength;
					
					path.animate([
						{ strokeDashoffset: pathLength, opacity: '1' },
						{ strokeDashoffset: 0, opacity: '1' }
					], {
						duration: duration,
						delay: delay,
						easing: 'ease-in-out',
						fill: 'forwards'
					});
				}
			});
			
			// Spark effects (circles)
			const sparkAnimations = [
				{ selector: 'circle[cx="12.2"]', delay: 280 },
				{ selector: 'circle[cx="10.6"]', delay: 160 },
				{ selector: 'circle[cx="14.3"]', delay: 480 }
			];
			
			sparkAnimations.forEach(({ selector, delay }) => {
				const circle = svgRef.querySelector(selector);
				if (circle) {
					circle.animate([
						{ transform: 'scale(0.6)', opacity: '0' },
						{ transform: 'scale(1.25)', opacity: '0.9' },
						{ transform: 'scale(1)', opacity: '0' }
					], {
						duration: 350,
						delay: delay,
						easing: 'ease-out'
					});
				}
			});
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
				element.style.strokeDasharray = '';
				element.style.strokeDashoffset = '';
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
	export function getControls(): BitcoinIconHandle {
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
		class="lucide lucide-bitcoin-icon lucide-bitcoin"
	>
		<g style="transform-origin: center;">
			<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894" />
			<path d="M10.551 19.089L5.86 18.047" />
			<path d="M10.551 19.089l-.347 1.97" />
			<path d="M12.114 12.195c4.924.869 6.14-6.025 1.215-6.893" />
			<path d="M12.114 12.195l-3.94-.694" />
			<path d="M13.329 5.301L8.29 4.26" />
			<path d="M14.198 5.302l.348-1.97" />
			<path d="M7.48 20.364l3.126-17.727" />
			
			<!-- Spark circles -->
			<circle cx="12.2" cy="12.2" r="0.9" fill="currentColor" style="transform-origin: center;" />
			<circle cx="10.6" cy="19.1" r="0.8" fill="currentColor" style="transform-origin: center;" />
			<circle cx="14.3" cy="5.3" r="0.7" fill="currentColor" style="transform-origin: center;" />
		</g>
	</svg>
</div>
