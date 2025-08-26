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
				{ transform: 'rotate(-3deg)' },
				{ transform: 'rotate(3deg)' },
				{ transform: 'rotate(-2deg)' },
				{ transform: 'rotate(0deg)' }
			], {
				duration: Math.floor(duration * 0.25),
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
			});
			currentAnimations.push(svgAnimation);
			
			
			const rect = svgRef.querySelector('rect');
			if (rect) {
				const rectAnimation = rect.animate([
					{ stroke: '#ef4444', opacity: '0.6' },
					{ stroke: '#dc2626', opacity: '1' },
					{ stroke: '#ef4444', opacity: '0.6' }
				], {
					duration: Math.floor(duration * 0.45),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(rectAnimation);
			}
			
			
			const tip = svgRef.querySelector('path');
			if (tip) {
				const tipAnimation = tip.animate([
					{ stroke: '#ef4444', opacity: '0.4' },
					{ stroke: '#dc2626', opacity: '1' },
					{ stroke: '#ef4444', opacity: '0.4' }
				], {
					duration: Math.floor(duration * 0.35),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'cubic-bezier(0.42, 0, 0.58, 1)'
				});
				currentAnimations.push(tipAnimation);
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
			const rect = svgRef.querySelector('rect');
			const tip = svgRef.querySelector('path');
			
			if (rect) {
				rect.style.stroke = 'currentColor';
				rect.style.opacity = '1';
			}
			if (tip) {
				tip.style.stroke = 'currentColor';
				tip.style.opacity = '1';
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
		<path d="M22 14L22 10" />
		<rect x="2" y="6" width="16" height="12" rx="2" />
	</svg>
</div>