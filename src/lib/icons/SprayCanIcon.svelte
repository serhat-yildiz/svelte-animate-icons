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
		duration = 1800,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
	
	const sprayPaths = [
		"M3 3h.01",
		"M7 5h.01", 
		"M11 7h.01",
		"M3 7h.01",
		"M7 9h.01",
		"M3 11h.01"
	];
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Can shake animation
			const canAnimation = svgRef.animate([
				{ transform: 'rotate(0deg) translateX(0px)' },
				{ transform: 'rotate(-2deg) translateX(-1px)' },
				{ transform: 'rotate(2deg) translateX(1px)' },
				{ transform: 'rotate(0deg) translateX(0px)' }
			], {
				duration: Math.floor(duration * 0.67),
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'ease-in-out'
			});
			currentAnimations.push(canAnimation);
			
			// Spray dots animation with staggered timing
			const sprayDots = svgRef.querySelectorAll('path[d*="h.01"]') as NodeListOf<SVGPathElement>;
			sprayDots.forEach((dot, index) => {
				setTimeout(() => {
					const dotAnimation = dot.animate([
						{ opacity: '0', transform: 'scale(0) translateY(0px)' },
						{ opacity: '1', transform: 'scale(1.2) translateY(-2px)' },
						{ opacity: '0.7', transform: 'scale(1) translateY(-4px)' },
						{ opacity: '0', transform: 'scale(0.8) translateY(-6px)' }
					], {
						duration: Math.floor(duration * 0.44),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-out'
					});
					currentAnimations.push(dotAnimation);
					
					if (index === sprayDots.length - 1) {
						dotAnimation.addEventListener('finish', () => {
							if (!loop && !autoPlay && currentState !== 'loading') {
								if (currentAnimations.every(anim => anim.playState === 'finished')) {
									stopAnimation();
								}
							}
							onAnimationEnd?.();
						});
					}
				}, index * Math.floor(duration * 0.11));
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'rotate(0deg) translateX(0px)';
			
			const sprayDots = svgRef.querySelectorAll('path[d*="h.01"]');
			sprayDots.forEach(dot => {
				dot.style.opacity = '1';
				dot.style.transform = 'scale(1) translateY(0px)';
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
		class="lucide lucide-spray-can-icon lucide-spray-can"
	>
		<path d="M3 3h.01" />
		<path d="M7 5h.01" />
		<path d="M11 7h.01" />
		<path d="M3 7h.01" />
		<path d="M7 9h.01" />
		<path d="M3 11h.01" />
		<path d="M16 12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2Z" />
		<path d="M12 6V4a2 2 0 0 1 2-2h3" />
		<path d="M18 4v2" />
	</svg>
</div>