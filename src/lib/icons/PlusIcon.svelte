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
		duration = 1000,
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
	let horizontalLineEl: SVGPathElement;
	let verticalLineEl: SVGPathElement;
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// SVG plus animation (scale and rotate)
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'scale(1) rotate(0deg)' },
					{ transform: 'scale(1.2) rotate(10deg)' },
					{ transform: 'scale(0.85) rotate(-10deg)' },
					{ transform: 'scale(1) rotate(0deg)' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(svgAnimation);
			}
			
			// Horizontal line drawing animation
			if (horizontalLineEl) {
				const hLength = horizontalLineEl.getTotalLength();
				horizontalLineEl.style.strokeDasharray = hLength + ' ' + hLength;
				horizontalLineEl.style.strokeDashoffset = hLength.toString();
				
				const hLineAnimation = horizontalLineEl.animate([
					{ strokeDashoffset: hLength, opacity: '1' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.6),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out',
					delay: 0
				});
				currentAnimations.push(hLineAnimation);
			}
			
			// Vertical line drawing animation (delayed)
			if (verticalLineEl) {
				const vLength = verticalLineEl.getTotalLength();
				verticalLineEl.style.strokeDasharray = vLength + ' ' + vLength;
				verticalLineEl.style.strokeDashoffset = vLength.toString();
				
				setTimeout(() => {
					const vLineAnimation = verticalLineEl.animate([
						{ strokeDashoffset: vLength, opacity: '1' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(vLineAnimation);
					
					// Handle animation completion
					vLineAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.4));
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
			svgRef.style.transform = 'scale(1) rotate(0deg)';
			
			// Reset horizontal line to normal state
			if (horizontalLineEl) {
				horizontalLineEl.style.strokeDasharray = 'none';
				horizontalLineEl.style.strokeDashoffset = '';
				horizontalLineEl.style.opacity = '1';
			}
			
			// Reset vertical line to normal state
			if (verticalLineEl) {
				verticalLineEl.style.strokeDasharray = 'none';
				verticalLineEl.style.strokeDashoffset = '';
				verticalLineEl.style.opacity = '1';
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
	>
		<path 
			bind:this={horizontalLineEl}
			d="M5 12h14"
		/>
		<path 
			bind:this={verticalLineEl}
			d="M12 5v14"
		/>
	</svg>
</div>