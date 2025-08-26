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
	  size = 32,
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
  
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
  
	let isAnimating = $state(false);
	let currentAnimation: Animation[] = [];
	let currentState = $state(animationState);
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  const firstCheck = svgRef.querySelector('path[d="M18 6 7 17l-5-5"]');
	  if (firstCheck) {
		const anim = firstCheck.animate(
		  [
			{ strokeDashoffset: '20', transform: 'scale(1)', opacity: '0.5' },
			{ strokeDashoffset: '10', transform: 'scale(1.2)', opacity: '0.75' },
			{ strokeDashoffset: '0', transform: 'scale(1)', opacity: '1' }
		  ],
		  { duration: 700, easing: 'ease-in-out', fill: 'forwards' }
		);
		currentAnimation.push(anim);
	  }
  
	  const secondCheck = svgRef.querySelector('path[d="m22 10-7.5 7.5L13 16"]');
	  if (secondCheck) {
		const anim = secondCheck.animate(
		  [
			{ opacity: '0', transform: 'translateX(-6px)' },
			{ opacity: '1', transform: 'translateX(0px)' }
		  ],
		  { duration: 500, delay: 350, easing: 'ease-out', fill: 'forwards' }
		);
		currentAnimation.push(anim);
	  }
  
	  setTimeout(() => {
		isAnimating = false;
		onAnimationEnd?.();
	  }, duration);
	}
  
	function stopAnimation() {
	  currentAnimation.forEach(anim => anim.cancel());
	  currentAnimation = [];
	  isAnimating = false;
	  if (svgRef) {
		const allPaths = svgRef.querySelectorAll('path');
		allPaths.forEach(path => {
		  path.style.strokeDashoffset = '0';
		  path.style.transform = 'scale(1) translateX(0px)';
		  path.style.opacity = '1';
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
		case 'success':
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
  
	// Public API
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getStatus() { return { isAnimating, currentState }; }
  </script>
  
  <div
	bind:this={containerRef}
	class={clsx("inline-flex", className)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
	onfocus={triggers.focus ? handleFocus : undefined}
	onblur={triggers.focus ? handleBlur : undefined}
	tabindex={triggers.focus ? 0 : -1}
	role={triggers.click || triggers.focus ? "button" : undefined}
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
	  class="lucide lucide-check-check"
	>
	  <path 
		d="M18 6 7 17l-5-5" 
		stroke-dasharray="20" 
		stroke-dashoffset="0"
		style="transform-origin: center;"
	  />
	  <path 
		d="m22 10-7.5 7.5L13 16" 
		stroke-dasharray="20" 
		stroke-dashoffset="0"
	  />
	</svg>
  </div>
  