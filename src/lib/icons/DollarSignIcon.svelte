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
  
	export interface DollarSignIconHandle {
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
			{ transform: 'scale(1) rotate(0deg) translateY(0px)' },
			{ transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
			{ transform: 'scale(1) rotate(2deg) translateY(0px)' },
			{ transform: 'scale(1) rotate(0deg) translateY(0px)' }
		  ],
		  {
			duration,
			easing: 'ease-in-out',
			iterations: loop || currentState === 'loading' ? Infinity : 1
		  }
		)
	  );
  
	  
	  const spine = svgRef.querySelector('line');
	  if (spine) {
		const length = spine.getTotalLength?.() ?? 20;
		spine.style.strokeDasharray = `${length} ${length}`;
		spine.style.strokeDashoffset = `${length}`;
		currentAnimations.push(
		  spine.animate(
			[
			  { strokeDashoffset: length, opacity: '0.8' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{ duration: 800, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  
	  const path = svgRef.querySelector('path');
	  if (path) {
		const length = path.getTotalLength();
		path.style.strokeDasharray = `${length} ${length}`;
		path.style.strokeDashoffset = `${length}`;
		currentAnimations.push(
		  path.animate(
			[
			  { strokeDashoffset: length, opacity: '0.7' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{ duration: 900, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  setTimeout(() => {
		if (!loop && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration);
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
  
	  if (svgRef) {
		svgRef.getAnimations().forEach((a) => a.cancel());
		svgRef.style.transform = '';
		const elements = svgRef.querySelectorAll('line, path');
		elements.forEach((el) => {
		  el.getAnimations().forEach((a) => a.cancel());
		  el.style.strokeDasharray = '';
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
	  style="transform-origin: center;"
	  class="lucide lucide-dollar-sign-icon lucide-dollar-sign"
	>
	  <line x1="12" x2="12" y1="2" y2="22" />
	  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
	</svg>
  </div>
  