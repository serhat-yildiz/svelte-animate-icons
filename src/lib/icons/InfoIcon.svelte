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
	  duration = 1400,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState: AnimationState = animationState;
  
	
	function runAnimation() {
	  if (!svgRef) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  
	  const circle = svgRef.querySelector('circle');
	  if (circle) {
		const pathLength = circle.getTotalLength();
		circle.style.strokeDasharray = `${pathLength} ${pathLength}`;
		circle.style.strokeDashoffset = `${pathLength}`;
		circle.animate(
		  [
			{ strokeDashoffset: pathLength, opacity: '0.6' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  { duration: 1500, easing: 'ease-in-out', iterations: loop ? Infinity : 1, fill: 'forwards' }
		);
	  }
  
	  
	  const infoPaths = svgRef.querySelectorAll('path');
	  infoPaths.forEach(path => {
		path.animate(
		  [
			{ transform: 'scale(1)', opacity: '1' },
			{ transform: 'scale(1.3)', opacity: '0.5' },
			{ transform: 'scale(0.8)', opacity: '1' },
			{ transform: 'scale(1)', opacity: '1' }
		  ],
		  { duration: 1000, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
		);
	  });
  
	  
	  svgRef.animate(
		[
		  { transform: 'rotate(0deg) scale(1)' },
		  { transform: 'rotate(-2deg) scale(1.08)' },
		  { transform: 'rotate(2deg) scale(0.95)' },
		  { transform: 'rotate(0deg) scale(1)' }
		],
		{ duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
	  );
  
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
	  class="lucide lucide-info-icon lucide-info"
	>
	  <circle cx="12" cy="12" r="10" />
	  <path d="M12 16v-4" style="transform-origin: center;" />
	  <path d="M12 8h.01" style="transform-origin: center;" />
	</svg>
  </div>
  