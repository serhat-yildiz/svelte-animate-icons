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
	
	
	let leftMainEl: SVGPathElement;
	let crossStrokeEl: SVGPathElement;
	let rightMainEl: SVGPathElement;
	let tailStrokeEl: SVGPathElement;
	
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			if (svgRef) {
				const svgAnimation = svgRef.animate([
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
					{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
					{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
					{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
				], {
					duration: Math.floor(duration * 0.75),
					iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
					easing: 'ease-in-out'
				});
				currentAnimations.push(svgAnimation);
			}
			
			
			const animateStroke = (element: SVGPathElement, delay: number, opacity: string) => {
				setTimeout(() => {
					const length = element.getTotalLength();
					element.style.strokeDasharray = length + ' ' + length;
					element.style.strokeDashoffset = length.toString();
					
					const animation = element.animate([
						{ strokeDashoffset: length, opacity },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.5),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(animation);
				}, delay);
			};
			
			if (leftMainEl) animateStroke(leftMainEl, Math.floor(duration * 0.04), '0.7');
			if (crossStrokeEl) animateStroke(crossStrokeEl, Math.floor(duration * 0.15), '0.8');
			if (rightMainEl) animateStroke(rightMainEl, Math.floor(duration * 0.25), '0.7');
			
			if (tailStrokeEl) {
				setTimeout(() => {
					const length = tailStrokeEl.getTotalLength();
					tailStrokeEl.style.strokeDasharray = length + ' ' + length;
					tailStrokeEl.style.strokeDashoffset = length.toString();
					
					const animation = tailStrokeEl.animate([
						{ strokeDashoffset: length, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.5),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(animation);
					
					animation.addEventListener('finish', () => {
						if (!loop && !autoPlay && currentState !== 'loading') {
							if (currentAnimations.every(anim => anim.playState === 'finished')) {
								stopAnimation();
							}
						}
						onAnimationEnd?.();
					});
				}, Math.floor(duration * 0.35));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
			
			[leftMainEl, crossStrokeEl, rightMainEl, tailStrokeEl].forEach(el => {
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
		class="lucide lucide-saudi-riyal-icon lucide-saudi-riyal"
	>
		<g opacity="0.35">
			<path d="M2 12h6" />
			<path d="M22 12h-6" />
			<path d="M10 12V8.5c0-3.5 4-4.5 8 0v7c0 1.5-2 2.5-4 0-2 2.5-4 1.5-4 0" />
			<path d="M2 20h2V8s1-1 3-1" />
		</g>

		<path
			bind:this={leftMainEl}
			d="M2 12h6"
		/>
		<path
			bind:this={crossStrokeEl}
			d="M22 12h-6"
		/>
		<path
			bind:this={rightMainEl}
			d="M10 12V8.5c0-3.5 4-4.5 8 0v7c0 1.5-2 2.5-4 0-2 2.5-4 1.5-4 0"
		/>
		<path
			bind:this={tailStrokeEl}
			d="M2 20h2V8s1-1 3-1"
		/>
	</svg>
</div>