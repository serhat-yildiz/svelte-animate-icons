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
	// Speed lines for animation
	const SPEED_LINES = [
		{ x1: 2, y1: 8, x2: 6, y2: 8, delay: 0 },
		{ x1: 2, y1: 12, x2: 8, y2: 12, delay: 0.1 },
		{ x1: 2, y1: 16, x2: 6, y2: 16, delay: 0.2 }
	];
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
  aria-label="plane-icon icon"
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
			
			d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
		/>
		{#each SPEED_LINES as line, index}
			<line
				x1={line.x1}
				y1={line.y1}
				x2={line.x2}
				y2={line.y2}
				class="speed-line {currentState === 'active' ? 'animate' : ''}"
				stroke-width="1"
				
				style="--delay: {line.delay}s"
			/>
		{/each}
  </svg>
</div>