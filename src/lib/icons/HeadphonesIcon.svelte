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
		duration = 1200,
		onAnimationStart,
		onAnimationEnd,
		...restProps
	}: Props = $props();
	export interface HeadphonesIconHandle {
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
		
		const svgAnim = svgRef.animate([
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.1) rotate(-3deg)' },
			{ transform: 'scale(0.95) rotate(3deg)' },
			{ transform: 'scale(1) rotate(-2deg)' },
			{ transform: 'scale(1) rotate(0deg)' }
		], {
			duration,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
		});
		currentAnimations.push(svgAnim);
		
		const path = svgRef.querySelector('path');
		if (path) {
			const pathAnim = path.animate([
				{ transform: 'scale(1)', opacity: '1' },
				{ transform: 'scale(1.2)', opacity: '0.7' },
				{ transform: 'scale(0.9)', opacity: '1' },
				{ transform: 'scale(1)', opacity: '1' }
			], {
				duration: duration * 0.75,
				easing: 'ease-in-out',
				iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
			});
			currentAnimations.push(pathAnim);
		}
		if (!(loop || autoPlay || currentState === 'loading')) {
			setTimeout(() => {
				stopAnimation();
				onAnimationEnd?.();
			}, duration + 100);
		}
	}
	function stopAnimation() {
		isAnimating = false;
		currentAnimations.forEach(a => a.cancel());
		currentAnimations = [];
		if (svgRef) {
			svgRef.getAnimations().forEach(a => a.cancel());
			const path = svgRef.querySelector('path');
			if (path) {
				path.getAnimations().forEach(a => a.cancel());
				path.style.transform = '';
				path.style.opacity = '1';
			}
			svgRef.style.transform = '';
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
		style="transform-origin: center;"
		class="lucide lucide-headphones-icon lucide-headphones"
	>
		<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
	</svg>
</div>
