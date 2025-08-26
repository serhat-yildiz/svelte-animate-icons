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

			const group = svgRef.querySelector('g');
			if (group) {
				currentAnimations.push(
					group.animate(
						[
							{ transform: 'scale(1) rotate(0deg)' },
							{ transform: 'scale(1.03) rotate(-0.5deg)' },
							{ transform: 'scale(1) rotate(0deg)' }
						],
						{ duration: 800, easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)' }
					)
				);
			}

			const rightPath = svgRef.querySelector('path[d*="m16 18"]');
			if (rightPath) {
				currentAnimations.push(
					rightPath.animate(
						[{ strokeDashoffset: '32' }, { strokeDashoffset: '0' }],
						{
							duration: 1100,
							delay: 120,
							easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)',
							fill: 'forwards'
						}
					)
				);
			}

			const leftPath = svgRef.querySelector('path[d*="m8 6"]');
			if (leftPath) {
				currentAnimations.push(
					leftPath.animate(
						[{ strokeDashoffset: '32' }, { strokeDashoffset: '0' }],
						{
							duration: 1100,
							delay: 280,
							easing: 'cubic-bezier(0.11, 0.99, 0.24, 1)',
							fill: 'forwards'
						}
					)
				);
			}

			currentAnimations.forEach((anim) => {
				anim.addEventListener('finish', () => {
					if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
					onAnimationEnd?.();
				});
			});
		}
	}

	function stopAnimation() {
		currentAnimations.forEach((anim) => anim.cancel());
		currentAnimations = [];
		if (svgRef) {
			isAnimating = false;
			svgRef.querySelectorAll('*').forEach((el) => {
				el.getAnimations().forEach((a) => a.cancel());
				el.style.transform = '';
				el.style.strokeDashoffset = '';
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

	// Public API
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
	class={clsx('inline-flex items-center justify-center', className)}
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
		class="lucide lucide-code-icon lucide-code"
	>
		<g style="transform-origin: center;">
			<path d="m16 18 6-6-6-6" stroke-dasharray="32" stroke-dashoffset="32" />
			<path d="m8 6-6 6 6 6" stroke-dasharray="32" stroke-dashoffset="32" />
		</g>
	</svg>
</div>
