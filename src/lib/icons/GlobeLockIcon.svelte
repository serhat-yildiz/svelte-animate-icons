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
		duration = 800,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	export interface IconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
		toggleAnimation: () => void;
		setAnimationState: (newState: string) => void;
		readonly isAnimating: boolean;
		readonly currentState: string;
	}
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimations: Animation[] = [];
	let currentState = $state(animationState);
	function startAnimation() {
		if (!svgRef || isAnimating) return;
		stopAnimation();
		isAnimating = true;
		onAnimationStart?.();
		
		const lockElements = svgRef.querySelectorAll('path[d*="M20 6V4"], rect');
		lockElements.forEach((element, i) => {
			const anim = element.animate([
				{ transform: 'rotate(0deg) translateX(0px)', opacity: '1' },
				{ transform: 'rotate(-8deg) translateX(-2px)', opacity: '1' },
				{ transform: 'rotate(8deg) translateX(2px)', opacity: '1' },
				{ transform: 'rotate(0deg) translateX(0px)', opacity: '1' }
			], { 
				duration,
				delay: i * 150,
				easing: 'ease-in-out',
				iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
			});
			currentAnimations.push(anim);
		});
		
		const paths = svgRef.querySelectorAll('path[d]:not([style]), circle');
		paths.forEach((path, i) => {
			const len = (path as SVGGeometryElement).getTotalLength?.() ?? 60;
			(path as SVGPathElement).style.strokeDasharray = `${len} ${len}`;
			(path as SVGPathElement).style.strokeDashoffset = `${len}`;
			
			const anim = path.animate([
				{ strokeDashoffset: len, opacity: '0.5' },
				{ strokeDashoffset: 0, opacity: '1' }
			], { 
				duration: duration * 0.8,
				delay: 200 + i * 200,
				easing: 'ease-in-out',
				iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
				fill: 'forwards'
			});
			currentAnimations.push(anim);
		});
		if (!(loop || autoPlay || currentState === 'loading')) {
			setTimeout(() => {
				stopAnimation();
				onAnimationEnd?.();
			}, duration + 500);
		}
	}
	function stopAnimation() {
		isAnimating = false;
		currentAnimations.forEach(a => a.cancel());
		currentAnimations = [];
		if (svgRef) {
			svgRef.getAnimations().forEach(a => a.cancel());
			svgRef.style.transform = '';
			const paths = svgRef.querySelectorAll('circle, path');
			paths.forEach(path => {
				path.getAnimations().forEach(a => a.cancel());
				(path as SVGPathElement).style.strokeDasharray = '';
				(path as SVGPathElement).style.strokeDashoffset = '';
				(path as SVGPathElement).style.opacity = '1';
				(path as SVGPathElement).style.transform = '';
			});
		}
	}
	function toggleAnimation() {
		isAnimating ? stopAnimation() : startAnimation();
	}
	function setAnimationState(newState: string) {
		currentState = newState as any;
		switch (newState) {
			case 'active':
			case 'loading':
				startAnimation();
				break;
			default:
				stopAnimation();
				break;
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
	$effect(() => setAnimationState(animationState));
	$effect(() => {
		if (autoPlay) startAnimation();
		return () => stopAnimation();
	});
	
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getIconStatus() { return { isAnimating, currentState }; }
</script>
<div 
	bind:this={containerRef}
	class={clsx('inline-flex', className)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
	role={triggers.click || triggers.focus ? 'button' : undefined}
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
		class="lucide lucide-globe-lock-icon lucide-globe-lock"
		style="transform-origin: center;"
	>
		<path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" />
		<path d="M2 12h8.5" />
		<path d="M20 6V4a2 2 0 1 0-4 0v2" style="transform-origin: center;" />
		<rect width="8" height="5" x="14" y="6" rx="1" style="transform-origin: center;" />
	</svg>
</div>
