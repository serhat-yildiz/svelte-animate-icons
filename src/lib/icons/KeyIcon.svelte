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
	  duration = 900,
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
  
	  
	  const group = svgRef.querySelector('g');
	  if (group) {
		group.animate(
		  [
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.01) rotate(-6deg)' },
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.01) rotate(6deg)' },
			{ transform: 'scale(1) rotate(0deg)' }
		  ],
		  { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', iterations: loop ? Infinity : 1 }
		);
	  }
  
	  
	  const circle = svgRef.querySelector('circle');
	  if (circle) {
		circle.animate(
		  [
			{ transform: 'scale(1)' },
			{ transform: 'scale(0.96)' },
			{ transform: 'scale(1.02)' },
			{ transform: 'scale(1)' }
		  ],
		  { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', iterations: loop ? Infinity : 1 }
		);
	  }
  
	  
	  const shaft = svgRef.querySelector('path[d*="m21 2"]');
	  if (shaft) {
		shaft.animate(
		  [
			{ transform: 'translateX(0px)' },
			{ transform: 'translateX(-0.6px)' },
			{ transform: 'translateX(0.6px)' },
			{ transform: 'translateX(0px)' }
		  ],
		  { duration, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', iterations: loop ? Infinity : 1 }
		);
	  }
  
	  
	  const head = svgRef.querySelector('path[d*="m15.5 7.5"]');
	  if (head) {
		head.animate(
		  [
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(-18deg) translate(-1px, -0.4px)' },
			{ transform: 'rotate(18deg) translate(1px, 0.4px)' },
			{ transform: 'rotate(0deg)' }
		  ],
		  {
			duration,
			delay: 40,
			easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
			iterations: loop ? Infinity : 1,
			transformOrigin: '19px 6px'
		  }
		);
	  }
  
	  setTimeout(() => {
		isAnimating = false;
		onAnimationEnd?.();
		if (!loop) currentState = 'idle';
	  }, duration + 100);
	}
  
	function resetAnimation() {
	  if (!svgRef) return;
	  svgRef.getAnimations().forEach(a => a.cancel());
	  svgRef.querySelectorAll('*').forEach(el => {
		el.getAnimations().forEach(a => a.cancel());
		(el as HTMLElement).style.transform = '';
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
	  isAnimating = false;
	  currentState = 'idle';
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
	  class="lucide lucide-key-icon lucide-key"
	  style="transform-origin: center;"
	>
	  <g style="transform-origin: center;">
		<circle cx="7.5" cy="15.5" r="5.5" />
		<path d="m21 2-9.6 9.6" />
		<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
	  </g>
	</svg>
  </div>
  