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
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Group sway animation
			const group = svgRef.querySelector('g');
			if (group) {
				const groupAnimation = group.animate([
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
					{ transform: 'scale(1.055) rotate(-2deg) translateY(-1px)' },
					{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
				], {
					duration: Math.floor(duration * 0.45),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(groupAnimation);
			}
			
			// Path drawing animations with different delays and durations
			const pathAnimations = [
				{ selector: 'path[d*="M11.767 19.089c4.924"]', delay: 60, baseDuration: 550 },
				{ selector: 'path[d*="M10.551 19.089L5.86"]', delay: 120, baseDuration: 450 },
				{ selector: 'path[d*="M10.551 19.089l-.347"]', delay: 180, baseDuration: 400 },
				{ selector: 'path[d*="M12.114 12.195c4.924"]', delay: 260, baseDuration: 600 },
				{ selector: 'path[d*="M12.114 12.195l-3.94"]', delay: 320, baseDuration: 450 },
				{ selector: 'path[d*="M13.329 5.301L8.29"]', delay: 400, baseDuration: 450 },
				{ selector: 'path[d*="M14.198 5.302l.348"]', delay: 460, baseDuration: 400 },
				{ selector: 'path[d*="M7.48 20.364l3.126"]', delay: 540, baseDuration: 750 }
			];
			
			pathAnimations.forEach(({ selector, delay, baseDuration }) => {
				const path = svgRef.querySelector(selector);
				if (path) {
					const pathLength = path.getTotalLength();
					path.style.strokeDasharray = pathLength + ' ' + pathLength;
					path.style.strokeDashoffset = pathLength;
					
					const pathAnimation = path.animate([
						{ strokeDashoffset: pathLength, opacity: '1' },
						{ strokeDashoffset: 0, opacity: '1' }
					], {
						duration: Math.floor(duration * (baseDuration / 2000)),
						delay: Math.floor(duration * (delay / 2000)),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out',
						fill: 'forwards'
					});
					currentAnimations.push(pathAnimation);
				}
			});
			
			// Spark effects (circles)
			const sparkAnimations = [
				{ selector: 'circle[cx="12.2"]', delay: 280 },
				{ selector: 'circle[cx="10.6"]', delay: 160 },
				{ selector: 'circle[cx="14.3"]', delay: 480 }
			];
			
			sparkAnimations.forEach(({ selector, delay }) => {
				const circle = svgRef.querySelector(selector);
				if (circle) {
					const sparkAnimation = circle.animate([
						{ transform: 'scale(0.6)', opacity: '0' },
						{ transform: 'scale(1.25)', opacity: '0.9' },
						{ transform: 'scale(1)', opacity: '0' }
					], {
						duration: Math.floor(duration * 0.175),
						delay: Math.floor(duration * (delay / 2000)),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-out'
					});
					currentAnimations.push(sparkAnimation);
				}
			});
			
			// Handle animation completion
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
			
			// Reset all elements to normal state
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
		
		// State-based animation logic
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
	
	// Reactive state changes - update animation when state prop changes
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
		class="lucide lucide-bitcoin-icon lucide-bitcoin"
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
