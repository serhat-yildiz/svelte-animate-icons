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
	
	// Refs for animation elements
	let shieldEl: SVGPathElement;
	let bodyEl: SVGPathElement;
	let headEl: SVGCircleElement;
	
	// Animation controls
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Shield drawing animation
			if (shieldEl) {
				const shieldLength = shieldEl.getTotalLength();
				shieldEl.style.strokeDasharray = shieldLength + ' ' + shieldLength;
				shieldEl.style.strokeDashoffset = shieldLength.toString();
				
				const shieldAnimation = shieldEl.animate([
					{ strokeDashoffset: shieldLength, opacity: '0.3' },
					{ strokeDashoffset: '0', opacity: '1' }
				], {
					duration: Math.floor(duration * 0.57),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(shieldAnimation);
			}
			
			// User head animation (delayed)
			if (headEl) {
				setTimeout(() => {
					const headAnimation = headEl.animate([
						{ opacity: '0', transform: 'scale(0.5)' },
						{ opacity: '1', transform: 'scale(1)' }
					], {
						duration: Math.floor(duration * 0.36),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-out'
					});
					currentAnimations.push(headAnimation);
				}, Math.floor(duration * 0.29));
			}
			
			// User body animation (delayed)
			if (bodyEl) {
				setTimeout(() => {
					const bodyLength = bodyEl.getTotalLength();
					bodyEl.style.strokeDasharray = bodyLength + ' ' + bodyLength;
					bodyEl.style.strokeDashoffset = bodyLength.toString();
					
					const bodyAnimation = bodyEl.animate([
						{ strokeDashoffset: bodyLength, opacity: '0.5' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.36),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(bodyAnimation);
					
					bodyAnimation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.5));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			
			if (shieldEl) {
				shieldEl.style.strokeDasharray = 'none';
				shieldEl.style.strokeDashoffset = '';
				shieldEl.style.opacity = '1';
			}
			
			if (headEl) {
				headEl.style.opacity = '1';
				headEl.style.transform = 'scale(1)';
			}
			
			if (bodyEl) {
				bodyEl.style.strokeDasharray = 'none';
				bodyEl.style.strokeDashoffset = '';
				bodyEl.style.opacity = '1';
			}
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
		class="lucide lucide-shield-user-icon lucide-shield-user"
	>
		<path 
			bind:this={shieldEl}
			d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
		/>
		<circle 
			bind:this={headEl}
			cx="12" 
			cy="10" 
			r="3"
		/>
		<path 
			bind:this={bodyEl}
			d="M6 18c0-4 3-6 6-6s6 2 6 6"
		/>
	</svg>
</div>