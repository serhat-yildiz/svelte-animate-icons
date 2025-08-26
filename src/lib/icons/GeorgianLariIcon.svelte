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
  
	export interface GeorgianLariIconHandle {
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
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
		  }
		)
	  );
  
	  
	  const paths = [
		{ selector: 'path[d*="M11.5 21"]', delay: 60 },
		{ selector: 'path[d*="M9 12V3"]', delay: 160 },
		{ selector: 'path[d*="M13 12V3"]', delay: 260 },
		{ selector: 'path[d*="M4 21h16"]', delay: 360 }
	  ];
  
	  paths.forEach(({ selector, delay }) => {
		const el = svgRef?.querySelector(selector) as SVGPathElement | null;
		if (el) {
		  const len = el.getTotalLength();
		  el.style.strokeDasharray = `${len} ${len}`;
		  el.style.strokeDashoffset = `${len}`;
  
		  const anim = el.animate(
			[
			  { strokeDashoffset: len, opacity: '0.7' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{
			  duration: 550,
			  delay,
			  easing: 'ease-in-out',
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  fill: 'forwards'
			}
		  );
		  currentAnimations.push(anim);
		}
	  });
  
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
		const animatedPaths = svgRef.querySelectorAll('path:not([opacity])');
		animatedPaths.forEach(path => {
		  path.getAnimations().forEach(a => a.cancel());
		  (path as SVGPathElement).style.strokeDasharray = '';
		  (path as SVGPathElement).style.strokeDashoffset = '';
		  (path as SVGPathElement).style.opacity = '1';
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
	export function getStatus() { return { isAnimating, currentState }; }
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
	  class="lucide lucide-georgian-lari-icon lucide-georgian-lari"
	  style="transform-origin: center;"
	>
	  <g opacity="0.35">
		<path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
		<path d="M13 12V3" />
		<path d="M4 21h16" />
		<path d="M9 12V3" />
	  </g>
	  <path d="M11.5 21a7.5 7.5 0 1 1 7.35-9" />
	  <path d="M9 12V3" />
	  <path d="M13 12V3" />
	  <path d="M4 21h16" />
	</svg>
  </div>
  