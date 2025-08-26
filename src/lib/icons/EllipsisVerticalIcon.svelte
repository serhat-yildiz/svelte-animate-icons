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
	  duration = 800,
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
  
	  const circles = svgRef.querySelectorAll('circle');
	  circles.forEach((circle, i) => {
		const anim = circle.animate(
		  [
			{ transform: 'translateY(-3px)', opacity: '0.4' },
			{ transform: 'translateY(0px)', opacity: '1' },
			{ transform: 'translateY(-3px)', opacity: '0.4' }
		  ],
		  {
			duration,
			delay: i * 200,
			iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			easing: 'ease-in-out'
		  }
		);
		currentAnimations.push(anim);
	  });
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 600);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		const circles = svgRef.querySelectorAll('circle');
		circles.forEach((circle) => {
		  circle.getAnimations().forEach((a) => a.cancel());
		  circle.style.transform = '';
		  circle.style.opacity = '0.7';
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
	  class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"
	>
	  <circle cx="12" cy="12" r="1" style="opacity: 0.7;" />
	  <circle cx="12" cy="5" r="1" style="opacity: 0.7;" />
	  <circle cx="12" cy="19" r="1" style="opacity: 0.7;" />
	</svg>
  </div>
  