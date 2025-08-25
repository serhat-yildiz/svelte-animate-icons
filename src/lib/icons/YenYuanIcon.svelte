<script lang="ts">
	import { clsx } from 'clsx';
	
	interface Props {
		size?: number;
		class?: string;
		[key: string]: any;
	}
	
	let { size = 28, class: className, ...restProps }: Props = $props();
	
	export interface YenYuanIcon {
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
			// SVG element animation
			svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate([0, -2, 2, 0]deg)' }
			], {
				duration: 1000,
				iterations: 1,
				easing: 'linear'
			});
			svgRef.animate([
				{ transform: 'scale(1)' },
				{ transform: 'scale([1, 1.06, 1])' }
			], {
				duration: 600,
				iterations: 1,
				direction: 'normal'
			});

			// Path 1 animation
			const path1 = svgRef.querySelectorAll('path')[0];
			if (path1) {
				path1.animate([
					{ strokeDasharray: '0 1000' },
					{ strokeDasharray: '1000 1000' }
				], {
					duration: 400,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}

			// Path 2 animation
			const path2 = svgRef.querySelectorAll('path')[1];
			if (path2) {
				path2.animate([
					{ strokeDasharray: '0 1000' },
					{ strokeDasharray: '1000 1000' }
				], {
					duration: 400,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}

			// Path 3 animation
			const path3 = svgRef.querySelectorAll('path')[2];
			if (path3) {
				path3.animate([
					{ strokeDasharray: '0 1000' },
					{ strokeDasharray: '1000 1000' }
				], {
					duration: 400,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
			}

		}
	}
	
	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			svgRef.getAnimations().forEach(animation => animation.cancel());
			// Path animasyonlarını da durdur
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.getAnimations().forEach(animation => animation.cancel());
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
	export function getControls(): YenYuanIcon {
		isControlled = true;
		return {
			startAnimation,
			stopAnimation
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx(className)}
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
		<path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" />
		<path d="M6 11h12" />
		<path d="M6 15h12" />
	</svg>
</div>