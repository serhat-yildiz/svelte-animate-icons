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
	let paperPlaneEl: SVGPathElement;
	let trailEl: SVGPathElement;
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			// SVG animation
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'rotate(0deg) translateX(0px) scale(1)' },
					{ transform: 'rotate(-5deg) translateX(2px) scale(1.05)' },
					{ transform: 'rotate(5deg) translateX(-2px) scale(0.95)' },
					{ transform: 'rotate(0deg) translateX(0px) scale(1)' }
				], {
					duration: duration,
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(svgAnimation);
			}
			
			// Paper plane path animation
			if (paperPlaneEl) {
				const planeLength = paperPlaneEl.getTotalLength();
				paperPlaneEl.style.strokeDasharray = planeLength + ' ' + planeLength;
				paperPlaneEl.style.strokeDashoffset = planeLength.toString();
				
				const planeAnimation = paperPlaneEl.animate([
					{ strokeDashoffset: planeLength, opacity: '0.5' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.75),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(planeAnimation);
			}
			
			// Trail animation (delayed)
			if (trailEl) {
				setTimeout(() => {
					const trailLength = trailEl.getTotalLength();
					trailEl.style.strokeDasharray = trailLength + ' ' + trailLength;
					trailEl.style.strokeDashoffset = trailLength.toString();
					
					const trailAnimation = trailEl.animate([
						{ strokeDashoffset: trailLength, opacity: '0.3' },
						{ strokeDashoffset: '0', opacity: '0.8' }
					], {
						duration: Math.floor(duration * 0.5),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(trailAnimation);
					
					trailAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.25));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'rotate(0deg) translateX(0px) scale(1)';
			
			[paperPlaneEl, trailEl].forEach(el => {
				if (el) {
					el.style.strokeDasharray = 'none';
					el.style.strokeDashoffset = '';
					el.style.opacity = '1';
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
		class="lucide lucide-send-icon lucide-send"
	>
		<path
			bind:this={paperPlaneEl}
			d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
		/>
		<path
			bind:this={trailEl}
			d="m21.854 2.147-10.94 10.939"
		/>
	</svg>
</div>