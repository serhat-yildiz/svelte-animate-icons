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
	  duration = 600,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	export interface DownloadIconHandle {
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
  
	  const group = svgRef.querySelector('g');
	  if (group) {
		currentAnimations.push(
		  group.animate(
			[
			  { transform: 'scale(1)' },
			  { transform: 'scale(1.02)' },
			  { transform: 'scale(1)' }
			],
			{
			  duration,
			  easing: 'ease-in-out',
			  iterations: loop || currentState === 'loading' ? Infinity : 1
			}
		  )
		);
	  }
  
	  const shaft = svgRef.querySelector('path[d*="M12 3v12"]');
	  if (shaft) {
		const length = shaft.getTotalLength?.() ?? 30;
		shaft.style.strokeDasharray = `${length} ${length}`;
		shaft.style.strokeDashoffset = `${length}`;
		currentAnimations.push(
		  shaft.animate(
			[
			  { strokeDashoffset: length, opacity: '0.4' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{ duration, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  const head = svgRef.querySelector('path[d*="m7 10"]');
	  if (head) {
		currentAnimations.push(
		  head.animate(
			[
			  { transform: 'translateY(-2px) scale(1)', opacity: '0.6' },
			  { transform: 'translateY(2px) scale(1.05)', opacity: '1' },
			  { transform: 'translateY(0px) scale(1)', opacity: '1' }
			],
			{ duration, delay: 50, easing: 'ease-in-out' }
		  )
		);
	  }
  
	  const tray = svgRef.querySelector('path[d*="M21 15"]');
	  if (tray) {
		const length = tray.getTotalLength?.() ?? 60;
		tray.style.strokeDasharray = `${length} ${length}`;
		tray.style.strokeDashoffset = `${length}`;
		currentAnimations.push(
		  tray.animate(
			[
			  { strokeDashoffset: length, opacity: '0.3' },
			  { strokeDashoffset: 0, opacity: '1' }
			],
			{ duration, delay: 100, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  setTimeout(() => {
		if (!loop && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration + 300);
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		svgRef.getAnimations().forEach((a) => a.cancel());
		const elements = svgRef.querySelectorAll('*');
		elements.forEach((el) => {
		  el.getAnimations().forEach((a) => a.cancel());
		  el.style.transform = '';
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
	class={clsx('inline-flex items-center justify-center', className)}
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
	  class="lucide lucide-download-icon lucide-download"
	  style="transform-origin: center;"
	>
	  <g style="transform-origin: center;">
		<path d="M12 3v12" stroke-dasharray="30" stroke-dashoffset="30" />
		<path d="m7 10 5 5 5-5" style="transform-origin: center;" />
		<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-dasharray="60" stroke-dashoffset="60" />
	  </g>
	</svg>
  </div>
  