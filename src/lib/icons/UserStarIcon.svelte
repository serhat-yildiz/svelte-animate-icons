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
  aria-label="user-star-icon icon"
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
<path
      bind:this={bodyEl}
      d="M8 15H7a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle bind:this={headEl} cx="10" cy="7" r="4" />
    <path
      bind:this={starEl}
      d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"
    />
  </svg>
</div>