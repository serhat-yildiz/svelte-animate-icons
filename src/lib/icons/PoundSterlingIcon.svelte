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
	
	// Refs for animation elements
	let curveEl: SVGPathElement;
	let midEl: SVGPathElement;
	let vertEl: SVGPathElement;
	let baseEl: SVGPathElement;
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// SVG animation
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
			
			// Curve stroke animation (delayed)
			if (curveEl) {
				setTimeout(() => {
					const curveLength = curveEl.getTotalLength();
					curveEl.style.strokeDasharray = curveLength + ' ' + curveLength;
					curveEl.style.strokeDashoffset = curveLength.toString();
					
					const curveAnimation = curveEl.animate([
						{ strokeDashoffset: curveLength, opacity: '0.7' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.4),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(curveAnimation);
				}, Math.floor(duration * 0.04));
			}
			
			// Mid stroke animation (delayed)
			if (midEl) {
				setTimeout(() => {
					const midLength = midEl.getTotalLength();
					midEl.style.strokeDasharray = midLength + ' ' + midLength;
					midEl.style.strokeDashoffset = midLength.toString();
					
					const midAnimation = midEl.animate([
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
			
			// Vertical stroke animation (delayed)
			if (vertEl) {
				setTimeout(() => {
					const vertLength = vertEl.getTotalLength();
					vertEl.style.strokeDasharray = vertLength + ' ' + vertLength;
					vertEl.style.strokeDashoffset = vertLength.toString();
					
					const vertAnimation = vertEl.animate([
						{ strokeDashoffset: vertLength, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.37),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(vertAnimation);
				}, Math.floor(duration * 0.17));
			}
			
			// Base stroke animation (delayed)
			if (baseEl) {
				setTimeout(() => {
					const baseLength = baseEl.getTotalLength();
					baseEl.style.strokeDasharray = baseLength + ' ' + baseLength;
					baseEl.style.strokeDashoffset = baseLength.toString();
					
					const baseAnimation = baseEl.animate([
						{ strokeDashoffset: baseLength, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.37),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(baseAnimation);
					
					// Handle animation completion
					baseAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.24));
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
			
			// Reset SVG
			svgRef.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
			
			// Reset all strokes to normal state
			[curveEl, midEl, vertEl, baseEl].forEach(el => {
				if (el) {
					el.style.strokeDasharray = 'none';
					el.style.strokeDashoffset = '';
					el.style.opacity = '1';
				}
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
		
		// State-based animation logic
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
	
	// Event handlers
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
	
	// Reactive state changes
	$effect(() => {
		if (svgRef) {
			setAnimationState(animationState);
		}
	});
	
	// Auto-play on mount
	$effect(() => {
		if (autoPlay && svgRef) {
			startAnimation();
		}
		
		// Cleanup on destroy
		return () => {
			stopAnimation();
		};
	});
	
	// Public API for external control
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
		class="lucide lucide-pound-sterling-icon lucide-pound-sterling"
	>
		<g opacity="0.35">
			<path d="M18 7c0-5.333-8-5.333-8 0" />
			<path d="M10 7v14" />
			<path d="M6 21h12" />
			<path d="M6 13h10" />
		</g>

		<path
			bind:this={curveEl}
			d="M18 7c0-5.333-8-5.333-8 0"
		/>
		<path
			bind:this={midEl}
			d="M6 13h10"
		/>
		<path
			bind:this={vertEl}
			d="M10 7v14"
		/>
		<path
			bind:this={baseEl}
			d="M6 21h12"
		/>
	</svg>
</div>