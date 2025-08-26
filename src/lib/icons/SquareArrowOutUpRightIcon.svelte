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
		duration = 1400,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
	
	
	let boxEl: SVGPathElement;
	let arrowLineEl: SVGPathElement;
	let arrowHeadEl: SVGPathElement;
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			if (boxEl) {
				const boxLength = boxEl.getTotalLength();
				boxEl.style.strokeDasharray = boxLength + ' ' + boxLength;
				boxEl.style.strokeDashoffset = boxLength.toString();
				
				const boxAnimation = boxEl.animate([
					{ strokeDashoffset: boxLength, opacity: '0.6' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.57),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(boxAnimation);
			}
			
			
			if (arrowLineEl) {
				setTimeout(() => {
					const lineLength = arrowLineEl.getTotalLength();
					arrowLineEl.style.strokeDasharray = lineLength + ' ' + lineLength;
					arrowLineEl.style.strokeDashoffset = lineLength.toString();
					
					const lineAnimation = arrowLineEl.animate([
						{ strokeDashoffset: lineLength, opacity: '0.5' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.36),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(lineAnimation);
				}, Math.floor(duration * 0.29));
			}
			
			
			if (arrowHeadEl) {
				setTimeout(() => {
					const headLength = arrowHeadEl.getTotalLength();
					arrowHeadEl.style.strokeDasharray = headLength + ' ' + headLength;
					arrowHeadEl.style.strokeDashoffset = headLength.toString();
					
					const headAnimation = arrowHeadEl.animate([
						{ strokeDashoffset: headLength, opacity: '0.4' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.29),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(headAnimation);
					
					headAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.64));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			[boxEl, arrowLineEl, arrowHeadEl].forEach(el => {
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
		class="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"
	>
		<path bind:this={boxEl} d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
		<path bind:this={arrowLineEl} d="m21 3-9 9" />
		<path bind:this={arrowHeadEl} d="M15 3h6v6" />
	</svg>
</div>