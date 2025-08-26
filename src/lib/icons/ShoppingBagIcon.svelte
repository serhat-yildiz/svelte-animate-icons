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
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			const svgAnimation = svgRef.animate([
				{ transform: 'scaleY(1) scaleX(1) rotate(0deg) translateY(0px)' },
				{ transform: 'scaleY(0.85) scaleX(1.1) rotate(-4deg) translateY(-3px)' },
				{ transform: 'scaleY(1.1) scaleX(0.9) rotate(4deg) translateY(0px)' },
				{ transform: 'scaleY(1) scaleX(1) rotate(-2deg) translateY(-1px)' },
				{ transform: 'scaleY(1) scaleX(1) rotate(0deg) translateY(0px)' }
			], {
				duration: duration,
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'ease-in-out'
			});
			currentAnimations.push(svgAnimation);
			
			svgAnimation.addEventListener('finish', () => {
				if (!loop && !autoPlay && currentState !== 'loading') {
					stopAnimation();
				}
				onAnimationEnd?.();
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'scaleY(1) scaleX(1) rotate(0deg) translateY(0px)';
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
		<path d="M16 10a4 4 0 0 1-8 0" />
		<path d="M3.103 6.034h17.794" />
		<path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
	</svg>
</div>