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
  
	export interface FigmaIconHandle {
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
  
	const paths = [
	  "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z",
	  "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z",
	  "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z",
	  "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z",
	  "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"
	];
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  stopAnimation();
	  isAnimating = true;
	  onAnimationStart?.();
  
	  
	  currentAnimations.push(
		svgRef.animate(
		  [
			{ transform: 'scale(1) rotate(0deg)' },
			{ transform: 'scale(1.05) rotate(-2deg)' },
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
  
	  
	  const pathElements = svgRef.querySelectorAll('path');
	  pathElements.forEach((path, i) => {
		const len = path.getTotalLength();
		path.style.strokeDasharray = `${len} ${len}`;
		path.style.strokeDashoffset = `${len}`;
  
		const anim = path.animate(
		  [
			{ strokeDashoffset: len, opacity: '0.6' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  {
			duration: duration,
			delay: i * 200,
			easing: 'ease-in-out',
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			fill: 'forwards'
		  }
		);
		currentAnimations.push(anim);
	  });
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 200 * paths.length);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach(a => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		svgRef.getAnimations().forEach(a => a.cancel());
		svgRef.style.transform = '';
		const pathElements = svgRef.querySelectorAll('path');
		pathElements.forEach(path => {
		  path.getAnimations().forEach(a => a.cancel());
		  path.style.strokeDasharray = '';
		  path.style.strokeDashoffset = '';
		  path.style.opacity = '1';
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
	  class="lucide lucide-figma-icon lucide-figma"
	  style="transform-origin: center;"
	>
	  {#each paths as d}
		<path {d} />
	  {/each}
	</svg>
  </div>
  