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
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  
	  svgRef.animate(
		[
		  { transform: 'rotate(0deg)' },
		  { transform: 'rotate(-2deg)' },
		  { transform: 'rotate(2deg)' },
		  { transform: 'rotate(0deg)' }
		],
		{ duration, iterations: loop ? Infinity : 1, easing: 'ease-in-out' }
	  );
  
	  
	  svgRef.animate(
		[
		  { transform: 'scale(1)' },
		  { transform: 'scale(1.06)' },
		  { transform: 'scale(1)' }
		],
		{ duration: duration * 0.6, iterations: loop ? Infinity : 1, easing: 'ease-in-out' }
	  );
  
	  
	  svgRef.querySelectorAll('path').forEach((p, i) => {
		const len = (p as SVGPathElement).getTotalLength();
		(p as SVGPathElement).style.strokeDasharray = `${len}`;
		(p as SVGPathElement).style.strokeDashoffset = `${len}`;
		p.animate(
		  [
			{ strokeDashoffset: len, opacity: '0.6' },
			{ strokeDashoffset: 0, opacity: '1' }
		  ],
		  { duration: duration * 0.5, delay: i * 100, easing: 'ease-in-out', fill: 'forwards' }
		);
	  });
  
	  setTimeout(() => {
		if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration + 200);
	}
  
	function stopAnimation() {
	  if (!svgRef) return;
	  isAnimating = false;
	  svgRef.getAnimations().forEach(a => a.cancel());
	  svgRef.querySelectorAll('path').forEach(p => {
		p.getAnimations().forEach(a => a.cancel());
		p.style.strokeDasharray = '';
		p.style.strokeDashoffset = '';
		p.style.opacity = '1';
	  });
	}
  
	function toggleAnimation() {
	  isAnimating ? stopAnimation() : startAnimation();
	}
  
	function setAnimationState(newState: string) {
	  currentState = newState as any;
	  if (newState === 'active' || newState === 'loading') {
		startAnimation();
	  } else {
		stopAnimation();
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
	  class="lucide lucide-yen-yuan-icon"
	>
	  <path d="M12 9.5V21m0-11.5L6 3m6 6.5L18 3" />
	  <path d="M6 11h12" />
	  <path d="M6 15h12" />
	</svg>
  </div>
  