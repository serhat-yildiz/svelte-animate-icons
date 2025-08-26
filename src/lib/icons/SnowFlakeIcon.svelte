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
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			// SVG rotation and scale animation
			const svgAnimation = svgRef.animate([
				{ transform: 'rotate(0deg) scale(1)' },
				{ transform: 'rotate(10deg) scale(1.05)' },
				{ transform: 'rotate(-10deg) scale(1.05)' },
				{ transform: 'rotate(0deg) scale(1)' }
			], {
				duration: duration,
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'ease-in-out'
			});
			currentAnimations.push(svgAnimation);
			
			// Individual path animations
			const paths = svgRef.querySelectorAll('path') as NodeListOf<SVGPathElement>;
			paths.forEach((path, index) => {
				setTimeout(() => {
					const pathAnimation = path.animate([
						{ opacity: '0.4', strokeWidth: '1' },
						{ opacity: '1', strokeWidth: '2' },
						{ opacity: '0.7', strokeWidth: '1.5' },
						{ opacity: '1', strokeWidth: '2' }
					], {
						duration: Math.floor(duration * 0.8),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(pathAnimation);
					
					if (index === paths.length - 1) {
						pathAnimation.addEventListener('finish', () => {
							if (!loop && !autoPlay && currentState !== 'loading') {
								if (currentAnimations.every(anim => anim.playState === 'finished')) {
									stopAnimation();
								}
							}
							onAnimationEnd?.();
						});
					}
				}, index * Math.floor(duration * 0.1));
			});
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'rotate(0deg) scale(1)';
			
			const paths = svgRef.querySelectorAll('path');
			paths.forEach(path => {
				path.style.opacity = '1';
				path.style.strokeWidth = '2';
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
		class="lucide lucide-snowflake-icon lucide-snowflake"
	>
		<path d="M12 2v20" />
		<path d="M5.636 5.636 18.364 18.364" />
		<path d="M18.364 5.636 5.636 18.364" />
		<path d="M9 9 6 6" />
		<path d="M15 15l3 3" />
		<path d="M15 9l3-3" />
		<path d="M9 15 6 18" />
		<path d="M4 12h3" />
		<path d="M17 12h3" />
		<path d="M12 4v3" />
		<path d="M12 17v3" />
	</svg>
</div>