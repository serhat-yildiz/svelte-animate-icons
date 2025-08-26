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
			
			
			const group = svgRef.querySelector('g');
			if (group) {
				const groupAnimation = group.animate([
					{ transform: 'rotate(0deg) scale(1)' },
					{ transform: 'rotate(-2.2deg) scale(1.015)' },
					{ transform: 'rotate(1.2deg) scale(1)' },
					{ transform: 'rotate(0deg) scale(1)' }
				], {
					duration: Math.floor(duration * 0.35),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(groupAnimation);
			}
			
			
			const spine = svgRef.querySelector('path[d="M12 18V5"]');
			if (spine) {
				const pathLength = spine.getTotalLength();
				spine.style.strokeDasharray = pathLength + ' ' + pathLength;
				spine.style.strokeDashoffset = pathLength;
				
				const spineAnimation = spine.animate([
					{ strokeDashoffset: pathLength, opacity: '0.55' },
					{ strokeDashoffset: 0, opacity: '1' }
				], {
					duration: Math.floor(duration * 0.25),
					delay: Math.floor(duration * 0.03),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
				currentAnimations.push(spineAnimation);
			}
			
			
			const lobePathsA = svgRef.querySelectorAll('path[d*="M15 13a4.17"], path[d*="M17.997 5.125"], path[d*="M19.967 17.483"], path[d*="M6.003 5.125"]');
			lobePathsA.forEach(path => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				const lobeAAnimation = path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6', transform: 'scale(0.98)' },
					{ strokeDashoffset: pathLength * 0.5, opacity: '0.8', transform: 'scale(1.02)' },
					{ strokeDashoffset: 0, opacity: '1', transform: 'scale(1)' }
				], {
					duration: Math.floor(duration * 0.3),
					delay: Math.floor(duration * 0.06),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
				currentAnimations.push(lobeAAnimation);
			});
			
			
			const lobePathsB = svgRef.querySelectorAll('path[d*="M17.598 6.5"], path[d*="M18 18a4"], path[d*="M6 18a4"]');
			lobePathsB.forEach(path => {
				const pathLength = path.getTotalLength();
				path.style.strokeDasharray = pathLength + ' ' + pathLength;
				path.style.strokeDashoffset = pathLength;
				
				const lobeBAnimation = path.animate([
					{ strokeDashoffset: pathLength, opacity: '0.6', transform: 'scale(1.02)' },
					{ strokeDashoffset: pathLength * 0.5, opacity: '0.8', transform: 'scale(0.98)' },
					{ strokeDashoffset: 0, opacity: '1', transform: 'scale(1)' }
				], {
					duration: Math.floor(duration * 0.31),
					delay: Math.floor(duration * 0.09),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out',
					fill: 'forwards'
				});
				currentAnimations.push(lobeBAnimation);
			});
			
			
			const sparkL = svgRef.querySelector('path[d*="M8.5 11.6"]');
			if (sparkL) {
				const pathLength = sparkL.getTotalLength();
				sparkL.style.strokeDasharray = pathLength + ' ' + pathLength;
				sparkL.style.strokeDashoffset = pathLength;
				
				const sparkLAnimation = sparkL.animate([
					{ strokeDashoffset: pathLength, opacity: '0' },
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: -pathLength * 0.5, opacity: '0' }
				], {
					duration: Math.floor(duration * 0.275),
					delay: Math.floor(duration * 0.13),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(sparkLAnimation);
			}
			
			
			const sparkR = svgRef.querySelector('path[d*="M13.8 9.4"]');
			if (sparkR) {
				const pathLength = sparkR.getTotalLength();
				sparkR.style.strokeDasharray = pathLength + ' ' + pathLength;
				sparkR.style.strokeDashoffset = pathLength;
				
				const sparkRAnimation = sparkR.animate([
					{ strokeDashoffset: pathLength, opacity: '0' },
					{ strokeDashoffset: 0, opacity: '1' },
					{ strokeDashoffset: -pathLength * 0.5, opacity: '0' }
				], {
					duration: Math.floor(duration * 0.275),
					delay: Math.floor(duration * 0.17),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(sparkRAnimation);
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
			
			
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(element => {
				element.style.transform = '';
				element.style.strokeDasharray = '';
				element.style.strokeDashoffset = '';
				element.style.opacity = '1';
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
		class="lucide lucide-brain-icon lucide-brain"
	>
		<g style="transform-origin: center;">
			<path d="M12 18V5" />
			<path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" style="transform-origin: center;" />
			<path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" style="transform-origin: center;" />
			<path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" style="transform-origin: center;" />
			<path d="M18 18a4 4 0 0 0 2-7.464" style="transform-origin: center;" />
			<path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" style="transform-origin: center;" />
			<path d="M6 18a4 4 0 0 1-2-7.464" style="transform-origin: center;" />
			<path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" style="transform-origin: center;" />
			<path d="M8.5 11.6 10.2 10.4" stroke="currentColor" stroke-width="1.4" />
			<path d="M13.8 9.4 15.6 10.7" stroke="currentColor" stroke-width="1.4" />
		</g>
	</svg>
</div>
