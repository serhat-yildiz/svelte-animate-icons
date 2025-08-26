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
	
	
	let topStrokeEl: SVGPathElement;
	let midStrokeEl: SVGPathElement;
	let pStrokeEl: SVGPathElement;
  
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
					{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
					{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
				], {
					duration: Math.floor(duration * 0.8),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(svgAnimation);
			}
			
			
			if (topStrokeEl) {
				setTimeout(() => {
					const topLength = topStrokeEl.getTotalLength();
					topStrokeEl.style.strokeDasharray = topLength + ' ' + topLength;
					topStrokeEl.style.strokeDashoffset = topLength.toString();
					
					const topAnimation = topStrokeEl.animate([
						{ strokeDashoffset: topLength, opacity: '0.7' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.4),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(topAnimation);
				}, Math.floor(duration * 0.04));
			}
			
			
			if (midStrokeEl) {
				setTimeout(() => {
					const midLength = midStrokeEl.getTotalLength();
					midStrokeEl.style.strokeDasharray = midLength + ' ' + midLength;
					midStrokeEl.style.strokeDashoffset = midLength.toString();
					
					const midAnimation = midStrokeEl.animate([
						{ strokeDashoffset: midLength, opacity: '0.7' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.37),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(midAnimation);
				}, Math.floor(duration * 0.11));
			}
			
			
			if (pStrokeEl) {
				setTimeout(() => {
					const pLength = pStrokeEl.getTotalLength();
					pStrokeEl.style.strokeDasharray = pLength + ' ' + pLength;
					pStrokeEl.style.strokeDashoffset = pLength.toString();
					
					const pAnimation = pStrokeEl.animate([
						{ strokeDashoffset: pLength, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(pAnimation);
					
					
					pAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.17));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => {
			animation.cancel();
		});
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			
			svgRef.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
			
			
			if (topStrokeEl) {
				topStrokeEl.style.strokeDasharray = 'none';
				topStrokeEl.style.strokeDashoffset = '';
				topStrokeEl.style.opacity = '1';
			}
			
			if (midStrokeEl) {
				midStrokeEl.style.strokeDasharray = 'none';
				midStrokeEl.style.strokeDashoffset = '';
				midStrokeEl.style.opacity = '1';
			}
			
			if (pStrokeEl) {
				pStrokeEl.style.strokeDasharray = 'none';
				pStrokeEl.style.strokeDashoffset = '';
				pStrokeEl.style.opacity = '1';
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
		class="lucide lucide-philippine-peso-icon lucide-philippine-peso"
	>
		<g opacity="0.35">
			<path d="M20 11H4" />
			<path d="M20 7H4" />
			<path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" />
		</g>

		<path
			bind:this={topStrokeEl}
			d="M20 7H4"
		/>
		<path
			bind:this={midStrokeEl}
			d="M20 11H4"
		/>
		<path
			bind:this={pStrokeEl}
			d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7"
		/>
	</svg>
</div>
