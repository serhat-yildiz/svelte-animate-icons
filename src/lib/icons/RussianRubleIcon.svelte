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
	let mainStrokeEl: SVGPathElement;
	let midStrokeEl: SVGPathElement;
	
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
			
			// Main stroke animation (delayed)
			if (mainStrokeEl) {
				setTimeout(() => {
					const mainLength = mainStrokeEl.getTotalLength();
					mainStrokeEl.style.strokeDasharray = mainLength + ' ' + mainLength;
					mainStrokeEl.style.strokeDashoffset = mainLength.toString();
					
					const mainAnimation = mainStrokeEl.animate([
						{ strokeDashoffset: mainLength, opacity: '0.7' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(mainAnimation);
				}, Math.floor(duration * 0.04));
			}
			
			// Mid stroke animation (delayed)
			if (midStrokeEl) {
				setTimeout(() => {
					const midLength = midStrokeEl.getTotalLength();
					midStrokeEl.style.strokeDasharray = midLength + ' ' + midLength;
					midStrokeEl.style.strokeDashoffset = midLength.toString();
					
					const midAnimation = midStrokeEl.animate([
						{ strokeDashoffset: midLength, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.4),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(midAnimation);
					
					// Handle animation completion
					midAnimation.addEventListener('finish', () => {
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
			
			// Reset SVG
			svgRef.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
			
			// Reset all strokes to normal state
			if (mainStrokeEl) {
				mainStrokeEl.style.strokeDasharray = 'none';
				mainStrokeEl.style.strokeDashoffset = '';
				mainStrokeEl.style.opacity = '1';
			}
			
			if (midStrokeEl) {
				midStrokeEl.style.strokeDasharray = 'none';
				midStrokeEl.style.strokeDashoffset = '';
				midStrokeEl.style.opacity = '1';
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
		class="lucide lucide-russian-ruble-icon lucide-russian-ruble"
	>
		<g opacity="0.35">
			<path d="M6 11h8a4 4 0 0 0 0-8H9v18" />
			<path d="M6 15h8" />
		</g>

		<path
			bind:this={mainStrokeEl}
			d="M6 11h8a4 4 0 0 0 0-8H9v18"
		/>
		<path
			bind:this={midStrokeEl}
			d="M6 15h8"
		/>
	</svg>
</div>