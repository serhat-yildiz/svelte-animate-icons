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
  
	export interface FacebookIconHandle {
	  startAnimation: () => void;
	  stopAnimation: () => void;
	  toggleAnimation: () => void;
	  setAnimationState: (newState: string) => void;
	  readonly isAnimating: boolean;
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
  
	  // SVG scale + rotate
	  currentAnimations.push(
		svgRef.animate(
		  [
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.1) rotate(-2deg)' },
			{ transform: 'scale(0.95) rotate(2deg)' },
			{ transform: 'scale(1) rotate(0deg)' }
		  ],
		  {
			duration,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
		  }
		)
	  );
  
	  // Path drawing
	  const path = svgRef.querySelector('path');
	  if (path) {
		const len = path.getTotalLength();
		path.style.strokeDasharray = `${len} ${len}`;
		path.style.strokeDashoffset = `${len}`;
		currentAnimations.push(
		  path.animate(
			[
			  { strokeDashoffset: len, opacity: '0.6' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{
			  duration: duration + 300,
			  easing: 'ease-in-out',
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  fill: 'forwards'
			}
		  )
		);
	  }
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 400);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach(a => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		svgRef.getAnimations().forEach(a => a.cancel());
		svgRef.style.transform = '';
		const path = svgRef.querySelector('path');
		if (path) {
		  path.getAnimations().forEach(a => a.cancel());
		  path.style.strokeDasharray = '';
		  path.style.strokeDashoffset = '';
		  path.style.opacity = '1';
		}
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
	class={clsx('inline-flex', className)}
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
	  class="lucide lucide-facebook-icon lucide-facebook"
	  style="transform-origin: center;"
	>
	  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
	</svg>
  </div>
  