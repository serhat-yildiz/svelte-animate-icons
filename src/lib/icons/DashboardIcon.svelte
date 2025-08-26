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
	  duration = 1300,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	export interface DashboardIconHandle {
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
			{ transform: 'scale(1.05) rotate(-2deg)' },
			{ transform: 'scale(0.95) rotate(2deg)' },
			{ transform: 'scale(1) rotate(0deg)' }
		  ],
		  {
			duration,
			easing: 'ease-in-out',
			iterations: loop || currentState === 'loading' ? Infinity : 1
		  }
		)
	  );
  
	  
	  const tiles = svgRef.querySelectorAll('rect');
	  tiles.forEach((tile, i) => {
		currentAnimations.push(
		  tile.animate(
			[
			  { opacity: '0.5', transform: 'scale(0.9) translateY(2px)' },
			  { opacity: '1', transform: 'scale(1.1) translateY(-2px)' },
			  { opacity: '0.8', transform: 'scale(1) translateY(0px)' },
			  { opacity: '1', transform: 'scale(1) translateY(0px)' }
			],
			{
			  duration: 1200,
			  delay: i * 200,
			  easing: 'ease-in-out',
			  iterations: loop || currentState === 'loading' ? Infinity : 1
			}
		  )
		);
	  });
  
	  setTimeout(() => {
		if (!loop && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration + 200);
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
  
	  svgRef?.getAnimations().forEach((a) => a.cancel());
	  svgRef && (svgRef.style.transform = '');
  
	  svgRef?.querySelectorAll('rect').forEach((tile) => {
		tile.getAnimations().forEach((a) => a.cancel());
		tile.style.transform = '';
		tile.style.opacity = '1';
	  });
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
	  class="lucide lucide-dashboard-icon lucide-dashboard"
	>
	  <rect width="7" height="9" x="3" y="3" rx="1" />
	  <rect width="7" height="5" x="14" y="3" rx="1" />
	  <rect width="7" height="9" x="14" y="12" rx="1" />
	  <rect width="7" height="5" x="3" y="16" rx="1" />
	</svg>
  </div>
  