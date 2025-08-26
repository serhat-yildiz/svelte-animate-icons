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
	
	export interface IconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
		toggleAnimation: () => void;
		setAnimationState: (newState: string) => void;
		readonly isAnimating: boolean;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimation: Animation | null = null;
	let currentState = $state(animationState);
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			const path = svgRef.querySelector('path');
			if (path) {
				
				path.style.strokeDasharray = '80 80';
				path.style.strokeDashoffset = '80';
				path.style.opacity = '0.6';
				
				
				currentAnimation = path.animate([
					{ strokeDasharray: '80 80', strokeDashoffset: '80', opacity: '0.6' },
					{ strokeDasharray: '80 80', strokeDashoffset: '0', opacity: '1' },
					{ strokeDasharray: '80 80', strokeDashoffset: '-80', opacity: '0.6' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				
				
				currentAnimation.addEventListener('finish', () => {
					if (!loop && !autoPlay && currentState !== 'loading') {
						stopAnimation();
					}
					onAnimationEnd?.();
				});
			}
		}
	}
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			const path = svgRef.querySelector('path');
			if (path) {
				
				path.style.strokeDasharray = 'none';
				path.style.strokeDashoffset = '';
				path.style.opacity = '1';
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
	
	export function getIconStatus() {
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
  onfocus={handleFocus}
  onblur={handleBlur}
  role={triggers.click || triggers.focus ? 'button' : 'img'}
  aria-label="bitcoin-icon icon"
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