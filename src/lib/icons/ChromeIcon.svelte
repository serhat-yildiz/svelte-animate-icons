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
	  duration = 4000,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  const outerCircle = svgRef.querySelector('circle[r="10"]');
	  const innerCircle = svgRef.querySelector('circle[r="4"]');
	  const lines = svgRef.querySelectorAll('line');
  
	  
	  if (outerCircle) {
		currentAnimations.push(
		  outerCircle.animate(
			[{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
			{
			  duration,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  easing: 'linear'
			}
		  )
		);
	  }
  
	  
	  if (innerCircle) {
		currentAnimations.push(
		  innerCircle.animate(
			[
			  { transform: 'scale(1)', opacity: '1' },
			  { transform: 'scale(1.2)', opacity: '0.7' },
			  { transform: 'scale(1)', opacity: '1' }
			],
			{
			  duration: 1500,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
			}
		  )
		);
	  }
  
	  
	  lines.forEach((line, i) => {
		currentAnimations.push(
		  line.animate(
			[{ opacity: '0.8' }, { opacity: '0.3' }, { opacity: '0.8' }],
			{
			  duration: 1200,
			  delay: i * 300,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
			}
		  )
		);
	  });
  
	  if (!loop && !autoPlay && currentState !== 'loading') {
		setTimeout(() => stopAnimation(), duration + 200);
	  }
  
	  onAnimationEnd?.();
	}
  
	function stopAnimation() {
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  isAnimating = false;
  
	  if (svgRef) {
		const allElements = svgRef.querySelectorAll('*');
		allElements.forEach((el) => {
		  el.style.transform = '';
		  el.style.opacity = '1';
		});
	  }
	}
  
	function toggleAnimation() {
	  if (isAnimating) stopAnimation();
	  else startAnimation();
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
  
	$effect(() => {
	  if (svgRef) setAnimationState(animationState);
	});
  
	$effect(() => {
	  if (autoPlay && svgRef) startAnimation();
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
	class={clsx('inline-flex items-center justify-center', className)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
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
	>
	  <circle cx="12" cy="12" r="10" style="transform-origin: center;" />
	  <circle cx="12" cy="12" r="4" style="transform-origin: center;" />
	  <line x1="21.17" y1="8" x2="12" y2="8" style="opacity: 0.8;" />
	  <line x1="3.95" y1="6.06" x2="8.54" y2="14" style="opacity: 0.8;" />
	  <line x1="10.88" y1="21.94" x2="15.46" y2="14" style="opacity: 0.8;" />
	</svg>
  </div>
  