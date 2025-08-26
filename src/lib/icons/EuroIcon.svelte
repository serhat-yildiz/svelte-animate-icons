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
  
	  
	  const svgAnim = svgRef.animate(
		[
		  { transform: 'scale(1) rotate(0deg) translateY(0px)' },
		  { transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
		  { transform: 'scale(1) rotate(2deg) translateY(0px)' },
		  { transform: 'scale(1) rotate(0deg) translateY(0px)' }
		],
		{ duration, easing: 'ease-in-out', iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1 }
	  );
	  currentAnimations.push(svgAnim);
  
	  
	  const topStroke = svgRef.querySelector('path[d*="M4 10h12"]:not([opacity])');
	  if (topStroke) {
		const len = topStroke.getTotalLength();
		topStroke.style.strokeDasharray = `${len} ${len}`;
		topStroke.style.strokeDashoffset = `${len}`;
		currentAnimations.push(
		  topStroke.animate(
			[{ strokeDashoffset: len, opacity: '0.7' }, { strokeDashoffset: 0, opacity: '1' }],
			{ duration: 500, delay: 60, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  
	  const midStroke = svgRef.querySelector('path[d*="M4 14h9"]:not([opacity])');
	  if (midStroke) {
		const len = midStroke.getTotalLength();
		midStroke.style.strokeDasharray = `${len} ${len}`;
		midStroke.style.strokeDashoffset = `${len}`;
		currentAnimations.push(
		  midStroke.animate(
			[{ strokeDashoffset: len, opacity: '0.7' }, { strokeDashoffset: 0, opacity: '1' }],
			{ duration: 600, delay: 160, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  
	  const curveStroke = svgRef.querySelector('path[d*="M19 6"]:not([opacity])');
	  if (curveStroke) {
		const len = curveStroke.getTotalLength();
		curveStroke.style.strokeDasharray = `${len} ${len}`;
		curveStroke.style.strokeDashoffset = `${len}`;
		currentAnimations.push(
		  curveStroke.animate(
			[{ strokeDashoffset: len, opacity: '0.8' }, { strokeDashoffset: 0, opacity: '1' }],
			{ duration: 900, delay: 260, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 1000);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		const paths = svgRef.querySelectorAll('path:not([opacity])');
		paths.forEach((p) => {
		  p.getAnimations().forEach((a) => a.cancel());
		  p.style.strokeDasharray = '';
		  p.style.strokeDashoffset = '';
		  p.style.opacity = '1';
		});
		svgRef.style.transform = '';
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
	export function getIconStatus() {
	  return { isAnimating, currentState };
	}
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
	  class="lucide lucide-euro-icon lucide-euro"
	  style="transform-origin: center;"
	>
	  <g opacity="0.35">
		<path d="M4 10h12" />
		<path d="M4 14h9" />
		<path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
	  </g>
  
	  <path d="M4 10h12" />
	  <path d="M4 14h9" />
	  <path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" />
	</svg>
  </div>
  