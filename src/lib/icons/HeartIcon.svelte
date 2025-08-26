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
	  duration = 400,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	export interface HeartIconHandle {
	  start: () => void;
	  stop: () => void;
	  toggle: () => void;
	  setState: (state: string) => void;
	  getStatus: () => { isAnimating: boolean; currentState: string };
	}
  
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  stopAnimation();
	  isAnimating = true;
	  onAnimationStart?.();
  
	  const leftPath = svgRef.querySelector('path[d*="M2 9.5a5.5"]');
	  if (leftPath) {
		const pathLength = leftPath.getTotalLength();
		leftPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		leftPath.style.strokeDashoffset = pathLength;
  
		currentAnimations.push(
		  leftPath.animate(
			[
			  { strokeDashoffset: pathLength },
			  { strokeDashoffset: 0 }
			],
			{
			  duration,
			  easing: 'cubic-bezier(0.42,0,0.58,1)',
			  fill: 'forwards'
			}
		  )
		);
	  }
  
	  const rightPath = svgRef.querySelector('path[d*="M12.409 5.824"]');
	  if (rightPath) {
		const pathLength = rightPath.getTotalLength();
		rightPath.style.strokeDasharray = pathLength + ' ' + pathLength;
		rightPath.style.strokeDashoffset = pathLength;
  
		currentAnimations.push(
		  rightPath.animate(
			[
			  { strokeDashoffset: pathLength },
			  { strokeDashoffset: 0 }
			],
			{
			  duration,
			  delay: 200,
			  easing: 'cubic-bezier(0.42,0,0.58,1)',
			  fill: 'forwards'
			}
		  )
		);
	  }
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 250);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach(a => a.cancel());
	  currentAnimations = [];
  
	  if (svgRef) {
		const paths = svgRef.querySelectorAll('path');
		paths.forEach(path => {
		  path.getAnimations().forEach(a => a.cancel());
		  path.style.strokeDasharray = '';
		  path.style.strokeDashoffset = '';
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
	  class="lucide lucide-heart-icon lucide-heart"
	  style="transform-origin:center;"
	>
	  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676" />
	  <path d="M12.409 5.824A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
	</svg>
  </div>
  