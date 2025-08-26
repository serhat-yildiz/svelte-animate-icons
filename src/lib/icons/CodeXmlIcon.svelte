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
	let currentAnimations: Animation[] = [];
	let currentState = $state(animationState);

	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			isAnimating = true;
			onAnimationStart?.();

			
			const leftArrow = svgRef.querySelector('path[d*="m6 8"]');
			if (leftArrow) {
				const pathLength = leftArrow.getTotalLength();
				leftArrow.style.strokeDasharray = `${pathLength} ${pathLength}`;
				leftArrow.style.strokeDashoffset = String(pathLength);
				currentAnimations.push(
					leftArrow.animate(
						[
							{ strokeDashoffset: pathLength, opacity: '0.6' },
							{ strokeDashoffset: 0, opacity: '1' }
						],
						{
							duration: 700,
							easing: 'ease-in-out',
							iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
							fill: 'forwards'
						}
					)
				);
			}

			
			const rightArrow = svgRef.querySelector('path[d*="m18 16"]');
			if (rightArrow) {
				const pathLength = rightArrow.getTotalLength();
				rightArrow.style.strokeDasharray = `${pathLength} ${pathLength}`;
				rightArrow.style.strokeDashoffset = String(pathLength);
				currentAnimations.push(
					rightArrow.animate(
						[
							{ strokeDashoffset: pathLength, opacity: '0.6' },
							{ strokeDashoffset: 0, opacity: '1' }
						],
						{
							duration: 700,
							delay: 100,
							easing: 'ease-in-out',
							iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
							fill: 'forwards'
						}
					)
				);
			}

			
			const slash = svgRef.querySelector('path[d*="m14.5 4"]');
			if (slash) {
				const pathLength = slash.getTotalLength();
				slash.style.strokeDasharray = `${pathLength} ${pathLength}`;
				currentAnimations.push(
					slash.animate(
						[
							{ strokeDashoffset: 0, opacity: '1' },
							{ strokeDashoffset: pathLength, opacity: '0.4' },
							{ strokeDashoffset: 0, opacity: '1' }
						],
						{
							duration,
							easing: 'ease-in-out',
							iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
						}
					)
				);
			}

			currentAnimations.forEach((anim) =>
				anim.addEventListener('finish', () => {
					if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
					onAnimationEnd?.();
				})
			);
		}
	}

	function stopAnimation() {
		currentAnimations.forEach((a) => a.cancel());
		currentAnimations = [];
		if (svgRef) {
			isAnimating = false;
			svgRef.querySelectorAll('path').forEach((p) => {
				p.getAnimations().forEach((a) => a.cancel());
				p.style.strokeDasharray = '';
				p.style.strokeDashoffset = '';
				p.style.opacity = '1';
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
			case 'idle':
			case 'success':
			case 'error':
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

	$effect(() => {
		if (svgRef) setAnimationState(animationState);
	});
	$effect(() => {
		if (autoPlay && svgRef) startAnimation();
		return () => stopAnimation();
	});

	
	export function start() {
		startAnimation();
	}
	export function stop() {
		stopAnimation();
	}
	export function toggle() {
		toggleAnimation();
	}
	export function setState(state: string) {
		setAnimationState(state);
	}
	export function getStatus() {
		return { isAnimating, currentState };
	}
</script>

<div
	bind:this={containerRef}
	class={clsx('inline-flex', className)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
	tabindex={triggers.focus ? 0 : -1}
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
		class="lucide lucide-code-xml-icon lucide-code-xml"
	>
		<path d="m6 8-4 4 4 4" />
		<path d="m18 16 4-4-4-4" />
		<path d="m14.5 4-5 16" />
	</svg>
</div>
