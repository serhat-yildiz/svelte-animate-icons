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
	  duration = 1400,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	export interface IconHandle {
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
  
	  
	  currentAnimations.push(
		svgRef.animate(
		  [
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.07) rotate(-2deg)' },
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
  
	  
	  const path = svgRef.querySelector('path');
	  if (path) {
		const len = path.getTotalLength();
		path.style.strokeDasharray = `${len} ${len}`;
		path.style.strokeDashoffset = `${len}`;
  
		const anim = path.animate(
		  [
			{ strokeDashoffset: len, opacity: '0.7' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  {
			duration: duration,
			delay: 200,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			fill: 'forwards'
		  }
		);
		currentAnimations.push(anim);
	  }
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 200);
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
	  class="lucide lucide-framer-icon lucide-framer"
	  style="transform-origin: center;"
	>
	  <path d="M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" />
	</svg>
  </div>
  