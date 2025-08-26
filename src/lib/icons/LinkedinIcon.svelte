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
		duration = 1500,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
	
	
	let pathEl: SVGPathElement;
	let rectEl: SVGRectElement;
	let circleEl: SVGCircleElement;
  
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'scale(1) rotate(0deg)' },
					{ transform: 'scale(1.08) rotate(-3deg)' },
					{ transform: 'scale(0.95) rotate(3deg)' },
					{ transform: 'scale(1) rotate(0deg)' }
				], {
					duration: Math.floor(duration * 0.87),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(svgAnimation);
			}
			
			
			if (pathEl) {
				const pathLength = pathEl.getTotalLength();
				pathEl.style.strokeDasharray = pathLength + ' ' + pathLength;
				pathEl.style.strokeDashoffset = pathLength.toString();
				
				const pathAnimation = pathEl.animate([
					{ strokeDashoffset: pathLength, opacity: '0.7' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(pathAnimation);
			}
			
			
			if (rectEl) {
				const rectLength = rectEl.getTotalLength();
				rectEl.style.strokeDasharray = rectLength + ' ' + rectLength;
				rectEl.style.strokeDashoffset = rectLength.toString();
				
				const rectAnimation = rectEl.animate([
					{ strokeDashoffset: rectLength, opacity: '0.7' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(rectAnimation);
			}
			
			
			if (circleEl) {
				const circleLength = circleEl.getTotalLength();
				circleEl.style.strokeDasharray = circleLength + ' ' + circleLength;
				circleEl.style.strokeDashoffset = circleLength.toString();
				
				const circleAnimation = circleEl.animate([
					{ strokeDashoffset: circleLength, opacity: '0.7' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(circleAnimation);
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
			
			
			svgRef.style.transform = 'scale(1) rotate(0deg)';
			
			
			if (pathEl) {
				pathEl.style.strokeDasharray = 'none';
				pathEl.style.strokeDashoffset = '';
				pathEl.style.opacity = '1';
			}
			
			if (rectEl) {
				rectEl.style.strokeDasharray = 'none';
				rectEl.style.strokeDashoffset = '';
				rectEl.style.opacity = '1';
			}
			
			if (circleEl) {
				circleEl.style.strokeDasharray = 'none';
				circleEl.style.strokeDashoffset = '';
				circleEl.style.opacity = '1';
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
			case 'success':
				startAnimation();
				break;
			case 'idle':
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
	tabindex={triggers.focus ? 0 : undefined}
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
		<path
			bind:this={pathEl}
			d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
		/>
		<rect
			bind:this={rectEl}
			width="4"
			height="12"
			x="2"
			y="9"
		/>
		<circle 
			bind:this={circleEl}
			cx="4" 
			cy="4" 
			r="2" 
		/>
	</svg>
</div>
