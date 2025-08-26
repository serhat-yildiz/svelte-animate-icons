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
	  duration = 1300,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState: AnimationState = animationState;
  
	// --- Core Animation ---
	function runAnimation() {
	  if (!svgRef) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  // SVG wiggle
	  svgRef.animate(
		[
		  { transform: 'scale(1) rotate(0deg)' },
		  { transform: 'scale(1.08) rotate(-2deg)' },
		  { transform: 'scale(0.95) rotate(2deg)' },
		  { transform: 'scale(1) rotate(0deg)' }
		],
		{ duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
	  );
  
	  // Outline + camera draw
	  const drawElements = svgRef.querySelectorAll('rect, path');
	  drawElements.forEach(el => {
		const len = el.getTotalLength();
		el.style.strokeDasharray = `${len} ${len}`;
		el.style.strokeDashoffset = `${len}`;
		el.animate(
		  [
			{ strokeDashoffset: len, opacity: '0.7' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  { duration: 1500, easing: 'ease-in-out', iterations: loop ? Infinity : 1, fill: 'forwards' }
		);
	  });
  
	  // Dot pulse
	  const dot = svgRef.querySelector('line');
	  if (dot) {
		dot.animate(
		  [
			{ transform: 'scale(1)', opacity: '1' },
			{ transform: 'scale(1.4)', opacity: '0.4' },
			{ transform: 'scale(1)', opacity: '1' }
		  ],
		  { duration: 1000, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
		);
	  }
  
	  setTimeout(() => {
		isAnimating = false;
		onAnimationEnd?.();
		if (!loop) currentState = 'idle';
	  }, duration + 200);
	}
  
	function resetAnimation() {
	  if (!svgRef) return;
	  svgRef.getAnimations().forEach(a => a.cancel());
	  svgRef.querySelectorAll('*').forEach(el => {
		el.getAnimations().forEach(a => a.cancel());
		(el as HTMLElement).style.transform = '';
		(el as HTMLElement).style.strokeDasharray = '';
		(el as HTMLElement).style.strokeDashoffset = '';
		(el as HTMLElement).style.opacity = '1';
	  });
	}
  
	// --- Public API ---
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
  
	// --- Event handlers ---
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
  
	// --- Reactivity ---
	$effect(() => {
	  setState(animationState);
	});
  
	$effect(() => {
	  if (autoPlay) start();
	  return () => stop();
	});
  </script>
  
  <div
	class={clsx('inline-flex', className)}
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
	  style="transform-origin: center;"
	  class="lucide lucide-instagram-icon lucide-instagram"
	>
	  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
	  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
	  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" style="transform-origin: center;" />
	</svg>
  </div>
  