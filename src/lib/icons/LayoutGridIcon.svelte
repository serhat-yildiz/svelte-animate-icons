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
		duration = 1200,
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
	let groupEl: SVGGElement;
	let tile1El: SVGRectElement;
	let tile2El: SVGRectElement;
	let tile3El: SVGRectElement;
	let tile4El: SVGRectElement;
	let sweepEl: SVGRectElement;
  
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); // Clear any existing animation
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Grid variants animation
			if (groupEl) {
				const groupAnimation = groupEl.animate([
					{ transform: 'scale(1) rotate(0deg)' },
					{ transform: 'scale(1.03) rotate(1deg)' },
					{ transform: 'scale(1) rotate(0deg)' }
				], {
					duration: Math.floor(duration * 0.5),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(groupAnimation);
			}
			
			// Tile animations with stagger
			const tiles = [tile1El, tile2El, tile3El, tile4El];
			tiles.forEach((tile, index) => {
				if (tile) {
					setTimeout(() => {
						const tileAnimation = tile.animate([
							{ opacity: '0.4', transform: 'scale(0.85)' },
							{ opacity: '1', transform: 'scale(1.08)' },
							{ opacity: '1', transform: 'scale(1)' }
						], {
							duration: Math.floor(duration * 0.46),
							iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
							easing: 'ease-out'
						});
						currentAnimations.push(tileAnimation);
					}, Math.floor(duration * 0.067) * index);
				}
			});
			
			// Sweep animation (delayed)
			if (sweepEl) {
				setTimeout(() => {
					const sweepAnimation = sweepEl.animate([
						{ transform: 'translate(-26px, -26px)', opacity: '0' },
						{ transform: 'translate(0px, 0px)', opacity: '0.35' },
						{ transform: 'translate(26px, 26px)', opacity: '0' }
					], {
						duration: Math.floor(duration * 0.67),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(sweepAnimation);
				}, Math.floor(duration * 0.083));
			}
			
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
			if (groupEl) {
				groupEl.style.transform = 'scale(1) rotate(0deg)';
			}
			
			const tiles = [tile1El, tile2El, tile3El, tile4El];
			tiles.forEach(tile => {
				if (tile) {
					tile.style.opacity = '1';
					tile.style.transform = 'scale(1)';
				}
			});
			
			if (sweepEl) {
				sweepEl.style.transform = 'translate(0px, 0px)';
				sweepEl.style.opacity = '0';
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
		<defs>
			<linearGradient id="grid-sweep" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stop-color="currentColor" stop-opacity="0" />
				<stop offset="50%" stop-color="currentColor" stop-opacity="0.35" />
				<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
			</linearGradient>
		</defs>

		<g bind:this={groupEl}>
			<rect
				bind:this={tile1El}
				width="7"
				height="7"
				x="3"
				y="3"
				rx="1"
			/>
			<rect
				bind:this={tile2El}
				width="7"
				height="7"
				x="14"
				y="3"
				rx="1"
			/>
			<rect
				bind:this={tile3El}
				width="7"
				height="7"
				x="14"
				y="14"
				rx="1"
			/>
			<rect
				bind:this={tile4El}
				width="7"
				height="7"
				x="3"
				y="14"
				rx="1"
			/>

			<rect
				bind:this={sweepEl}
				x="2"
				y="2"
				width="20"
				height="20"
				rx="3"
				fill="url(#grid-sweep)"
				style="pointer-events: none; opacity: 0;"
			/>
		</g>
	</svg>
</div>
