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
					{ transform: 'translateX(1px)' },
					{ transform: 'translateX(0px)' }
				], {
					duration: Math.floor(duration * 0.7),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(clapperAnimation);
			}
			
			
			const minus = svgRef.querySelector('path[d*="15 8h6"]'); 
			if (minus) {
				const minusAnimation = minus.animate([
					{ transform: 'scaleX(1) rotate(0deg)', opacity: '1' },
					{ transform: 'scaleX(0.6) rotate(-10deg)', opacity: '0.6' },
					{ transform: 'scaleX(1.2) rotate(10deg)', opacity: '1' },
					{ transform: 'scaleX(1) rotate(0deg)', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.6),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(minusAnimation);
			}
			
			
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
			const minus = svgRef.querySelector('path[d*="15 8h6"]');
			
			if (clapper) {
				clapper.style.transform = 'translateX(0px)';
			}
			if (minus) {
				minus.style.transform = 'scaleX(1) rotate(0deg)';
				minus.style.opacity = '1';
			}
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
		<path d="M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12" />
	</svg>
</div>