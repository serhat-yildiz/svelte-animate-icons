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
		duration = 2000,
		onAnimationStart,
		onAnimationEnd,
		...restProps 
	}: Props = $props();

	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimation: Animation[] = [];
	let currentState = $state(animationState);

	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation();
			isAnimating = true;
			onAnimationStart?.();

			const group = svgRef.querySelector('g');
			if (group) {
				currentAnimation.push(group.animate([
					{ transform: 'scale(1)' },
					{ transform: 'scale(1.02)' },
					{ transform: 'scale(1)' }
				], { duration: 600, easing: 'ease-in-out' }));
			}

			const cloud = svgRef.querySelector('path[d*="M4 14.899"]');
			if (cloud) {
				currentAnimation.push(cloud.animate([
					{ strokeDashoffset: '100', opacity: '0.4' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 700, easing: 'ease-in-out', fill: 'forwards' }));
			}

			const shaft = svgRef.querySelector('path[d*="M12 13v8"]');
			if (shaft) {
				currentAnimation.push(shaft.animate([
					{ strokeDashoffset: '30', opacity: '0.5' },
					{ strokeDashoffset: '0', opacity: '1' }
				], { duration: 550, delay: 50, easing: 'ease-in-out', fill: 'forwards' }));
			}

			const head = svgRef.querySelector('path[d*="m8 17"]');
			if (head) {
				currentAnimation.push(head.animate([
					{ transform: 'translateY(2px) scale(1)', opacity: '0.7' },
					{ transform: 'translateY(-2px) scale(1.06)', opacity: '1' },
					{ transform: 'translateY(0px) scale(1)', opacity: '1' }
				], { duration: 600, delay: 100, easing: 'ease-in-out' }));
			}

			currentAnimation.forEach(anim => {
				anim.addEventListener('finish', () => {
					if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
					onAnimationEnd?.();
				});
			});
		}
	}

	function stopAnimation() {
		currentAnimation.forEach(anim => anim.cancel());
		currentAnimation = [];
		if (svgRef) {
			isAnimating = false;
			svgRef.querySelectorAll('*').forEach(el => {
				el.getAnimations().forEach(a => a.cancel());
				el.style.transform = '';
				el.style.strokeDashoffset = '';
				el.style.opacity = '1';
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
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getStatus() { return { isAnimating, currentState }; }
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
		class="lucide lucide-cloud-upload-icon lucide-cloud-upload"
	>
		<g style="transform-origin: center;">
			<path 
				d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" 
				stroke-dasharray="100" 
				stroke-dashoffset="100"
			/>
			<path 
				d="M12 13v8" 
				stroke-dasharray="30" 
				stroke-dashoffset="30"
			/>
			<path d="m8 17 4-4 4 4" style="transform-origin: center;" />
		</g>
	</svg>
</div>
