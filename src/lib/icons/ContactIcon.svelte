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

	export interface ContactIconHandle {
		start: () => void;
		stop: () => void;
		toggle: () => void;
		setState: (newState: string) => void;
		getStatus: () => { isAnimating: boolean; currentState: string };
	}

	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimation: Animation | null = null;
	let currentState = $state(animationState);

	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			isAnimating = true;
			onAnimationStart?.();

			// Rect
			const rect = svgRef.querySelector('rect');
			if (rect) {
				const length = rect.getTotalLength?.() ?? 100;
				rect.style.strokeDasharray = `${length} ${length}`;
				rect.style.strokeDashoffset = `${length}`;
				rect.animate(
					[
						{ strokeDashoffset: length, opacity: '0.3' },
						{ strokeDashoffset: 0, opacity: '1' }
					],
					{ duration: duration * 0.6, easing: 'ease-in-out', fill: 'forwards' }
				);
			}

			// Circle (delay)
			const circle = svgRef.querySelector('circle');
			if (circle) {
				circle.animate(
					[
						{ transform: 'scale(0.5)', opacity: '0' },
						{ transform: 'scale(1.2)', opacity: '1' },
						{ transform: 'scale(1)', opacity: '1' }
					],
					{ duration: duration * 0.5, delay: duration * 0.25, easing: 'ease-out' }
				);
			}

			// Lines (delay)
			const lines = svgRef.querySelectorAll('path[d*="v2"]');
			lines.forEach(line => {
				line.animate(
					[
						{ transform: 'translateX(-10px)', opacity: '0' },
						{ transform: 'translateX(0px)', opacity: '1' }
					],
					{ duration: duration * 0.35, delay: duration * 0.4, easing: 'ease-out' }
				);
			});

			// Curve (delay)
			const curve = svgRef.querySelector('path[d*="M7 22"]');
			if (curve) {
				const length = curve.getTotalLength?.() ?? 30;
				curve.style.strokeDasharray = `${length} ${length}`;
				curve.style.strokeDashoffset = `${length}`;
				curve.animate(
					[
						{ strokeDashoffset: length, opacity: '0' },
						{ strokeDashoffset: 0, opacity: '1' }
					],
					{ duration: duration * 0.5, delay: duration * 0.5, easing: 'ease-in-out', fill: 'forwards' }
				);
			}

			// cleanup animation state
			setTimeout(() => {
				if (!loop && !autoPlay && currentState !== 'loading') {
					stopAnimation();
				}
				onAnimationEnd?.();
			}, duration);
		}
	}

	function stopAnimation() {
		if (svgRef) {
			isAnimating = false;
			const allElements = svgRef.querySelectorAll('*');
			allElements.forEach(el => {
				el.getAnimations().forEach(a => a.cancel());
				el.style.transform = '';
				el.style.strokeDasharray = '';
				el.style.strokeDashoffset = '';
				el.style.opacity = '1';
			});
		}
		currentAnimation = null;
	}

	function toggleAnimation() {
		if (isAnimating) stopAnimation();
		else startAnimation();
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

	// Event handlers
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

	// Reactive updates
	$effect(() => {
		if (svgRef) setAnimationState(animationState);
	});
	$effect(() => {
		if (autoPlay && svgRef) startAnimation();
		return () => stopAnimation();
	});

	// Public API
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getStatus() {
		return { isAnimating, currentState };
	}
</script>

<div
	bind:this={containerRef}
	class={clsx('inline-flex items-center justify-center', className)}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	on:click={handleClick}
	on:focus={triggers.focus ? handleFocus : undefined}
	on:blur={triggers.focus ? handleBlur : undefined}
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
		class="lucide lucide-contact-icon lucide-contact"
	>
		<path d="M16 2v2" />
		<path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
		<path d="M8 2v2" />
		<circle cx="12" cy="11" r="3" style="transform-origin: center;" />
		<rect x="3" y="4" width="18" height="18" rx="2" />
	</svg>
</div>
