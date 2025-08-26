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
  
	export interface ExternalLinkIconHandle {
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
  
	  // Arrow parts
	  const arrowPaths = [
		svgRef.querySelector('path[d*="M15 3h6v6"]'),
		svgRef.querySelector('path[d*="M10 14 21 3"]')
	  ];
	  arrowPaths.forEach((path) => {
		if (path) {
		  currentAnimations.push(
			path.animate(
			  [
				{ transform: 'translate(0,0)', opacity: '1' },
				{ transform: 'translate(3px,-3px)', opacity: '1' },
				{ transform: 'translate(0,0)', opacity: '1' }
			  ],
			  {
				duration: 600,
				easing: 'ease-in-out',
				iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
			  }
			)
		  );
		}
	  });
  
	  // Box drawing
	  const box = svgRef.querySelector('path[d*="M18 13"]');
	  if (box) {
		const len = box.getTotalLength();
		box.style.strokeDasharray = `${len} ${len}`;
		box.style.strokeDashoffset = `${len}`;
		currentAnimations.push(
		  box.animate(
			[{ strokeDashoffset: len, opacity: '0.6' }, { strokeDashoffset: 0, opacity: '1' }],
			{ duration, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  if (!(loop || autoPlay || currentState === 'loading')) {
		setTimeout(() => {
		  stopAnimation();
		  onAnimationEnd?.();
		}, duration + 500);
	  }
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  if (svgRef) {
		const allPaths = svgRef.querySelectorAll('path');
		allPaths.forEach((p) => {
		  p.getAnimations().forEach((a) => a.cancel());
		  p.style.transform = '';
		  p.style.strokeDasharray = '';
		  p.style.strokeDashoffset = '';
		  p.style.opacity = '1';
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
  
	// Public API
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
	  class="lucide lucide-external-link-icon lucide-external-link"
	>
	  <path d="M15 3h6v6" />
	  <path d="M10 14 21 3" />
	  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
	</svg>
  </div>
  