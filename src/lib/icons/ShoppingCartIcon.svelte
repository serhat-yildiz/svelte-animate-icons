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
		duration = 1600,
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
	let wheel1El: SVGCircleElement;
	let wheel2El: SVGCircleElement;
	let cartEl: SVGPathElement;
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Cart bounce animation
			if (cartEl) {
				const cartAnimation = cartEl.animate([
					{ transform: 'translateY(0px) rotate(0deg)' },
					{ transform: 'translateY(-3px) rotate(-4deg)' },
					{ transform: 'translateY(0px) rotate(3deg)' },
					{ transform: 'translateY(-1px) rotate(-2deg)' },
					{ transform: 'translateY(0px) rotate(0deg)' }
				], {
					duration: Math.floor(duration * 0.94),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(cartAnimation);
			}
			
			// Wheel animations
			[wheel1El, wheel2El].forEach((wheel, index) => {
				if (wheel) {
					const wheelAnimation = wheel.animate([
						{ transform: 'rotate(0deg)' },
						{ transform: 'rotate(360deg)' }
					], {
						duration: Math.floor(duration * 0.75),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'linear'
					});
					currentAnimations.push(wheelAnimation);
					
					if (index === 1) {
						wheelAnimation.addEventListener('finish', () => {
							if (!loop && !autoPlay && currentState !== 'loading') {
								if (currentAnimations.every(anim => anim.playState === 'finished')) {
									stopAnimation();
								}
							}
							onAnimationEnd?.();
						});
					}
				}
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			if (cartEl) cartEl.style.transform = 'translateY(0px) rotate(0deg)';
			[wheel1El, wheel2El].forEach(wheel => {
				if (wheel) wheel.style.transform = 'rotate(0deg)';
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
	>
		<circle bind:this={wheel1El} cx="8" cy="21" r="1" />
		<circle bind:this={wheel2El} cx="19" cy="21" r="1" />
		<path bind:this={cartEl} d="M4 1h2.5L9 7h12.5l-1.5 6H8L6 4H4z" />
	</svg>
</div>