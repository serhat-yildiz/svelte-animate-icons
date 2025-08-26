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
	  duration = 1000,
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
  
	  const paths = svgRef.querySelectorAll('path');
	  const dots = [paths[0], paths[1], paths[2]];
  
	  // Dots stagger animation
	  dots.forEach((dot, i) => {
		if (dot) {
		  currentAnimations.push(
			dot.animate(
			  [
				{ opacity: '0.3' },
				{ opacity: '1' },
				{ opacity: '0.3' }
			  ],
			  {
				duration,
				delay: i * 300,
				iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
				easing: 'ease-in-out'
			  }
			)
		  );
		}
	  });
  
	  // Left arrow
	  if (paths[3]) {
		currentAnimations.push(
		  paths[3].animate(
			[
			  { transform: 'translateX(0px)', opacity: '1' },
			  { transform: 'translateX(-4px)', opacity: '0.5' },
			  { transform: 'translateX(0px)', opacity: '1' }
			],
			{
			  duration,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  // Right arrow
	  if (paths[4]) {
		currentAnimations.push(
		  paths[4].animate(
			[
			  { transform: 'translateX(0px)', opacity: '1' },
			  { transform: 'translateX(4px)', opacity: '0.5' },
			  { transform: 'translateX(0px)', opacity: '1' }
			],
			{
			  duration,
			  delay: 200,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  setTimeout(() => {
		if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration);
	}
  
	function stopAnimation() {
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  isAnimating = false;
  
	  if (svgRef) {
		const paths = svgRef.querySelectorAll('path');
		paths.forEach((path, i) => {
		  if (i < 3) {
			path.style.opacity = '0.3'; // dots reset
		  } else {
			path.style.transform = 'translateX(0px)';
			path.style.opacity = '1'; // arrows reset
		  }
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
  
	// Public API
	export function start() { startAnimation(); }
	export function stop() { stopAnimation(); }
	export function toggle() { toggleAnimation(); }
	export function setState(state: string) { setAnimationState(state); }
	export function getStatus() { return { isAnimating, currentState }; }
  </script>
  
  <div
	bind:this={containerRef}
	class={clsx('inline-flex', className)}
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
	  class="lucide lucide-chevrons-left-right-ellipsis"
	>
	  <path d="M8 12h.01" style="opacity: 0.3;" />
	  <path d="M12 12h.01" style="opacity: 0.3;" />
	  <path d="M16 12h.01" style="opacity: 0.3;" />
	  <path d="m7 7-5 5 5 5" stroke="currentColor" />
	  <path d="m17 7 5 5-5 5" stroke="currentColor" />
	</svg>
  </div>
  