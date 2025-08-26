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
	
	
	let mainStrokeEl: SVGPathElement;
	let topStrokeEl: SVGPathElement;
	let midStrokeEl: SVGPathElement;
	
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			
			isAnimating = true;
			onAnimationStart?.();
			
			
			const svgAnimation = svgRef.animate([
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
				{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
				{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
				{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
			], {
				duration: Math.floor(duration * 0.8),
				iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
				easing: 'ease-in-out'
			});
			currentAnimations.push(svgAnimation);
			
			
			const animateStroke = (element: SVGPathElement, delay: number, opacity: string) => {
				setTimeout(() => {
					const length = element.getTotalLength();
					element.style.strokeDasharray = length + ' ' + length;
					element.style.strokeDashoffset = length.toString();
					
					const animation = element.animate([
						{ strokeDashoffset: length, opacity },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
						iterations: loop || autoPlay || (currentState === 'loading') ? Infinity : 1,
						easing: 'ease-in-out'
					});
					currentAnimations.push(animation);
				}, delay);
			};
			
			if (mainStrokeEl) animateStroke(mainStrokeEl, Math.floor(duration * 0.04), '0.75');
			if (topStrokeEl) animateStroke(topStrokeEl, Math.floor(duration * 0.15), '0.8');
			
			if (midStrokeEl) {
				setTimeout(() => {
					const length = midStrokeEl.getTotalLength();
					midStrokeEl.style.strokeDasharray = length + ' ' + length;
					midStrokeEl.style.strokeDashoffset = length.toString();
					
					const animation = midStrokeEl.animate([
						{ strokeDashoffset: length, opacity: '0.8' },
						{ strokeDashoffset: '0', opacity: '1' }
					], {
						duration: Math.floor(duration * 0.6),
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
				}, Math.floor(duration * 0.27));
			}
		}
	}
	
	function stopAnimation() {
		currentAnimations.forEach(animation => animation.cancel());
		currentAnimations = [];
		
		if (svgRef) {
			isAnimating = false;
			svgRef.style.transform = 'scale(1) rotate(0deg) translateY(0px)';
			
			[mainStrokeEl, topStrokeEl, midStrokeEl].forEach(el => {
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
		class="lucide lucide-swiss-franc-icon lucide-swiss-franc"
	>
		<g opacity="0.35">
			<path d="M10 21V3h8" />
			<path d="M6 16h9" />
			<path d="M10 9.5h7" />
		</g>

		<path
			bind:this={mainStrokeEl}
			d="M10 21V3h8"
		/>
		<path
			bind:this={topStrokeEl}
			d="M10 9.5h7"
		/>
		<path
			bind:this={midStrokeEl}
			d="M6 16h9"
		/>
	</svg>
</div>