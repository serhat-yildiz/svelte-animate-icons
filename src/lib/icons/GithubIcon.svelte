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
	  duration = 1000,
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
			{ transform: 'scale(1)' },
			{ transform: 'scale(1.05)' },
			{ transform: 'scale(1)' }
		  ],
		  {
			duration,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
		  }
		)
	  );
  
	  
	  const bodyPath = svgRef.querySelector('path[d*="M15 22v-4"]') as SVGPathElement | null;
	  if (bodyPath) {
		const len = bodyPath.getTotalLength();
		bodyPath.style.strokeDasharray = `${len} ${len}`;
		const anim = bodyPath.animate(
		  [
			{ strokeDashoffset: len, opacity: '0.7' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  {
			duration,
			delay: 100,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			fill: 'forwards'
		  }
		);
		currentAnimations.push(anim);
	  }
  
	  
	  const handPath = svgRef.querySelector('path[d*="M9 18c"]') as SVGPathElement | null;
	  if (handPath) {
		const anim = handPath.animate(
		  [
			{ transform: 'rotate(0deg)' },
			{ transform: 'rotate(20deg)' },
			{ transform: 'rotate(-15deg)' },
			{ transform: 'rotate(0deg)' }
		  ],
		  {
			duration,
			delay: 250,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
		  }
		);
		currentAnimations.push(anim);
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
		const paths = svgRef.querySelectorAll('path');
		paths.forEach(path => {
		  path.getAnimations().forEach(a => a.cancel());
		  (path as SVGPathElement).style.strokeDasharray = '';
		  (path as SVGPathElement).style.strokeDashoffset = '';
		  (path as SVGPathElement).style.opacity = '1';
		  (path as SVGPathElement).style.transform = '';
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
	  class="lucide lucide-github-icon lucide-github"
	  style="transform-origin: center;"
	>
	  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5
		.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5
		-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2
		c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9
		c0 3.5 3 5.5 6 5.5
		-.39.49-.68 1.05-.85 1.65
		-.17.6-.22 1.23-.15 1.85v4" />
	  <path d="M9 18c-4.51 2-5-2-7-2" style="transform-origin: 90% 50%;" />
	</svg>
  </div>
  