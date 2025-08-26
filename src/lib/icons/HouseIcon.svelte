<script lang="ts">
	import { clsx } from 'clsx';
  
	type AnimationState = 'idle' | 'active' | 'loading' | 'success' | 'error';
  
	interface Props {
	  size?: number;
	  class?: string;
	  triggers?: { hover?: boolean; click?: boolean; focus?: boolean; custom?: boolean };
	  animationState?: AnimationState;
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
	let currentState: AnimationState = animationState;
	let isAnimating = $state(false);
  
	// ---- Core Animations ----
	function runAnimation() {
	  if (!svgRef) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  // Wiggle animation
	  const houseGroup = svgRef.querySelector('g.house');
	  houseGroup?.animate(
		[
		  { transform: 'rotate(0deg) scale(1)' },
		  { transform: 'rotate(-1.5deg) scale(1.02)' },
		  { transform: 'rotate(1.5deg) scale(1)' },
		  { transform: 'rotate(0deg) scale(1)' },
		],
		{ duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
	  );
  
	  // Outline
	  const housePath = svgRef.querySelector('path[d*="M3 10a2 2"]');
	  housePath?.animate(
		[
		  { strokeDashoffset: '100', opacity: '0.35' },
		  { strokeDashoffset: '0', opacity: '1' },
		],
		{ duration: duration * 0.7, easing: 'ease-in-out', fill: 'forwards' }
	  );
  
	  // Door
	  const doorPath = svgRef.querySelector('path[d*="M15 21v-8"]');
	  doorPath?.animate(
		[
		  { transform: 'scaleY(0.6)', opacity: '0' },
		  { transform: 'scaleY(1.15)', opacity: '1' },
		  { transform: 'scaleY(1)', opacity: '1' },
		],
		{ duration: 500, delay: 450, easing: 'ease-out' }
	  );
  
	  // Smoke
	  const smokeGroup = svgRef.querySelector('g.smoke');
	  smokeGroup?.animate(
		[
		  { opacity: '0', transform: 'translateY(0px) scale(0.8)' },
		  { opacity: '0.7', transform: 'translateY(-6px) scale(1)' },
		  { opacity: '0', transform: 'translateY(-10px) scale(1.1)' },
		],
		{ duration: duration * 0.9, delay: 300, easing: 'ease-in-out' }
	  );
  
	  setTimeout(() => {
		isAnimating = false;
		onAnimationEnd?.();
		if (!loop) currentState = 'idle';
	  }, duration + 500);
	}
  
	function resetAnimation() {
	  if (!svgRef) return;
	  svgRef.getAnimations().forEach((a) => a.cancel());
	  svgRef.querySelectorAll('*').forEach((el) => {
		el.getAnimations().forEach((a) => a.cancel());
		(el as HTMLElement).style.transform = '';
		(el as HTMLElement).style.opacity = '1';
		(el as HTMLElement).style.strokeDashoffset = '';
	  });
	}
  
	// ---- Public API ----
	export function start() {
	  if (!isAnimating) {
		currentState = 'active';
		runAnimation();
	  }
	}
	export function stop() {
	  resetAnimation();
	  currentState = 'idle';
	  isAnimating = false;
	}
	export function toggle() {
	  isAnimating ? stop() : start();
	}
	export function setState(state: AnimationState) {
	  currentState = state;
	  if (state === 'active' || state === 'loading') start();
	  else stop();
	}
	export function getStatus() {
	  return { state: currentState, isAnimating };
	}
  
	// ---- Event handlers ----
	function handleMouseEnter() {
	  if (triggers.hover && !triggers.custom) start();
	}
	function handleMouseLeave() {
	  if (triggers.hover && !triggers.custom) stop();
	}
	function handleClick() {
	  if (triggers.click) toggle();
	}
	function handleFocus() {
	  if (triggers.focus) start();
	}
	function handleBlur() {
	  if (triggers.focus) stop();
	}
  
	// ---- Reactivity ----
	$effect(() => {
	  setState(animationState);
	});
  
	$effect(() => {
	  if (autoPlay) start();
	  return () => stop();
	});
  </script>
  
  <div
	bind:this={containerRef}
	class={clsx('inline-flex items-center justify-center', className)}
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	on:click={handleClick}
	on:focus={handleFocus}
	on:blur={handleBlur}
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
	  class="lucide lucide-house-icon lucide-house"
	  style="transform-origin: center;"
	>
	  <g class="house" style="transform-origin: center;">
		<path
		  d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
		  stroke-dasharray="100"
		  stroke-dashoffset="100"
		/>
		<path
		  d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
		  style="transform-origin: center;"
		/>
	  </g>
	  <g class="smoke" style="opacity: 0; transform-origin: center;">
		<circle cx="16.5" cy="6" r="0.8" />
		<circle cx="17.5" cy="4.5" r="0.6" />
		<circle cx="18.3" cy="3.2" r="0.45" />
	  </g>
	</svg>
  </div>
  