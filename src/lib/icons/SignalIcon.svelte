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
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
	
	
	let swayGroupEl: SVGGElement;
	let dotEl: SVGPathElement;
	let bar1El: SVGPathElement;
	let bar2El: SVGPathElement;
	let bar3El: SVGPathElement;
	let bar4El: SVGPathElement;
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			const bars = [bar1El, bar2El, bar3El, bar4El];
			const delays = [0, 0.1, 0.2, 0.3];
			
			bars.forEach((bar, index) => {
				if (bar) {
					setTimeout(() => {
						const barAnimation = bar.animate([
							{ opacity: '0.3', transform: 'scaleY(0.5)' },
							{ opacity: '1', transform: 'scaleY(1)' },
							{ opacity: '0.6', transform: 'scaleY(0.8)' },
							{ opacity: '1', transform: 'scaleY(1)' }
						], {
							duration: Math.floor(duration * 0.6),
							iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
							easing: 'ease-in-out'
						});
						currentAnimations.push(barAnimation);
						
						if (index === bars.length - 1) {
							barAnimation.addEventListener('finish', () => {
								if (!loop && !autoPlay && currentState !== 'loading') {
									if (currentAnimations.every(anim => anim.playState === 'finished')) {
										stopAnimation();
									}
								}
								onAnimationEnd?.();
							});
						}
					}, Math.floor(duration * delays[index]));
				}
			});
			
			
			if (dotEl) {
				const dotAnimation = dotEl.animate([
					{ opacity: '0.4', transform: 'scale(1)' },
					{ opacity: '1', transform: 'scale(1.2)' },
					{ opacity: '0.7', transform: 'scale(1)' }
				], {
					duration: Math.floor(duration * 0.8),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(dotAnimation);
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			[bar1El, bar2El, bar3El, bar4El, dotEl].forEach(el => {
				if (el) {
					el.style.opacity = '1';
					el.style.transform = 'scaleY(1) scale(1)';
				}
			});
		}
	}
	
	function toggleAnimation() {
		if (isAnimating) stopAnimation();
		else startAnimation();
	}
	
	function setAnimationState(newState: string) {
		currentState = newState as any;
		switch (newState) {
			case 'active': case 'loading': case 'success':
				startAnimation(); break;
			default: stopAnimation(); break;
		}
	}
	
	function handleMouseEnter() {
		if (triggers.hover && !triggers.custom) startAnimation();
	}
	
	function handleMouseLeave() {
		if (triggers.hover && !triggers.custom) stopAnimation();
	}
	
	function handleClick() {
		if (triggers.click) toggleAnimation();
	}
	
	function handleFocus() {
		if (triggers.focus) startAnimation();
	}
	
	function handleBlur() {
		if (triggers.focus) stopAnimation();
	}
	
	$effect(() => { if (svgRef) setAnimationState(animationState); });
	$effect(() => { if (autoPlay && svgRef) startAnimation(); return () => stopAnimation(); });
	
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getStatus() { return { isAnimating, currentState }; }
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
		class="lucide lucide-signal-icon lucide-signal"
	>
		<g bind:this={swayGroupEl}>
			<path bind:this={dotEl} d="M12 12h.01" />
			<path bind:this={bar1El} d="M10 14v-4" />
			<path bind:this={bar2El} d="M14 14v-4" />
			<path bind:this={bar3El} d="M6 16v-8" />
			<path bind:this={bar4El} d="M18 16v-8" />
		</g>
	</svg>
</div>