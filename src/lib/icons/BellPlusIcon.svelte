<script lang="ts">
	import { clsx } from 'clsx';
	
	interface AnimationTriggers {
		hover?: boolean;
		click?: boolean;
		focus?: boolean;
		custom?: boolean;
	}
	
	interface Props {
		size?: number;
		class?: string;
		triggers?: AnimationTriggers;
		animationState?: 'idle' | 'active' | 'loading' | 'success' | 'error';
		autoPlay?: boolean;
		loop?: boolean;
		duration?: number;
		onAnimationStart?: () => void;
		onAnimationEnd?: () => void;
		[key: string]: any;
	}
	
	let { 
		size = 28, 
		class: className, 
		triggers = { hover: true },
		animationState = 'idle',
		autoPlay = false,
		loop = false,
		duration = 2000,
		onAnimationStart,
		onAnimationEnd,
		...restProps 
	}: Props = $props();
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimations: Animation[] = [];
	let currentState = $state(animationState);
	
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			const svgAnimation = svgRef.animate([
				{ transform: 'rotate(0deg)' },
				{ transform: 'rotate(-12deg)' },
				{ transform: 'rotate(10deg)' },
				{ transform: 'rotate(-6deg)' },
				{ transform: 'rotate(3deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: Math.floor(duration * 0.7),
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'ease-in-out'
			});
			currentAnimations.push(svgAnimation);
			
			
			const clapper = svgRef.querySelector('path[d*="21a2"]'); 
			if (clapper) {
				const clapperAnimation = clapper.animate([
					{ transform: 'translateX(0px)' },
					{ transform: 'translateX(-3px)' },
					{ transform: 'translateX(3px)' },
					{ transform: 'translateX(-2px)' },
					{ transform: 'translateX(2px)' },
					{ transform: 'translateX(0px)' }
				], {
					duration: Math.floor(duration * 0.7),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(clapperAnimation);
			}
			
			
			const plusPaths = svgRef.querySelectorAll('path[d*="15 8h6"], path[d*="18 5v6"]'); 
			plusPaths.forEach(path => {
				const plusAnimation = path.animate([
					{ transform: 'scale(1) rotate(0deg)', opacity: '1' },
					{ transform: 'scale(1.3) rotate(45deg)', opacity: '0.9' },
					{ transform: 'scale(0.9) rotate(-45deg)', opacity: '1' },
					{ transform: 'scale(1.1) rotate(0deg)', opacity: '1' },
					{ transform: 'scale(1) rotate(0deg)', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.7),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(plusAnimation);
			});
			
			
			const lastAnimation = currentAnimations[currentAnimations.length - 1];
			lastAnimation?.addEventListener('finish', () => {
				if (!loop && !autoPlay && currentState !== 'loading') {
					if (currentAnimations.every(anim => anim.playState === 'finished')) {
						stopAnimation();
					}
				}
				onAnimationEnd?.();
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => {
			animation.cancel();
		});
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			
			svgRef.style.transform = 'rotate(0deg)';
			const clapper = svgRef.querySelector('path[d*="21a2"]');
			const plusPaths = svgRef.querySelectorAll('path[d*="15 8h6"], path[d*="18 5v6"]');
			
			if (clapper) {
				clapper.style.transform = 'translateX(0px)';
			}
			plusPaths.forEach(path => {
				path.style.transform = 'scale(1) rotate(0deg)';
				path.style.opacity = '1';
			});
		}
	}
	
	function toggleAnimation() {
		if (isAnimating) {
			stopAnimation();
		} else {
			startAnimation();
		}
	}
	
	function setAnimationState(newState: string) {
		currentState = newState as any;
		
		
		switch (newState) {
			case 'active':
			case 'loading':
				startAnimation();
				break;
			case 'idle':
			case 'success':
			case 'error':
			default:
				stopAnimation();
				break;
		}
	}
	
	
	function handleMouseEnter() {
		if (triggers.hover && !triggers.custom) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (triggers.hover && !triggers.custom) {
			stopAnimation();
		}
	}
	
	function handleClick() {
		if (triggers.click) {
			toggleAnimation();
		}
	}
	
	function handleFocus() {
		if (triggers.focus) {
			startAnimation();
		}
	}
	
	function handleBlur() {
		if (triggers.focus) {
			stopAnimation();
		}
	}
	
	
	$effect(() => {
		if (svgRef) {
			setAnimationState(animationState);
		}
	});
	
	
	$effect(() => {
		if (autoPlay && svgRef) {
			startAnimation();
		}
		
		
		return () => {
			stopAnimation();
		};
	});
	
	
	export function start() {
		startAnimation();
	}
	
	export function stop() {
		stopAnimation();
	}
	
	export function toggle() {
		toggleAnimation();
	}
	
	export function setState(state: string) {
		setAnimationState(state);
	}
	
	export function getStatus() {
		return {
			isAnimating,
			currentState
		};
	}
</script>

<div 
	bind:this={containerRef}
	class={clsx('inline-flex', className)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
	tabindex={triggers.focus ? 0 : -1}
	role={triggers.click || triggers.focus ? "button" : undefined}
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
		<path d="M10.268 21a2 2 0 0 0 3.464 0" />
		<path d="M15 8h6" style="transform-origin: center;" />
		<path d="M18 5v6" style="transform-origin: center;" />
		<path d="M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332" />
	</svg>
</div>