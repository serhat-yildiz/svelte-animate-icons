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
	  duration = 700,
	  onAnimationStart,
	  onAnimationEnd,
	  ...restProps
	}: Props = $props();
  
	export interface CreditCardIconHandle {
	  startAnimation: () => void;
	  stopAnimation: () => void;
	  toggleAnimation: () => void;
	  setAnimationState: (newState: string) => void;
	  readonly isAnimating: boolean;
	}
  
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let groupEl: SVGGElement;
	let rectEl: SVGRectElement;
	let stripeEl: SVGLineElement;
	let swipeEl: SVGPathElement;
  
	let isAnimating = $state(false);
	let currentAnimation: Animation[] = [];
	let currentState = $state(animationState);
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  stopAnimation();
	  isAnimating = true;
	  onAnimationStart?.();
  
	  // Card tilt
	  if (groupEl) {
		currentAnimation.push(
		  groupEl.animate(
			[
			  { transform: 'rotate(0deg) scale(1) translateX(0px) translateY(0px)' },
			  { transform: 'rotate(-4deg) scale(1.02) translateX(-0.4px) translateY(-0.3px)' },
			  { transform: 'rotate(2deg) scale(1) translateX(0px) translateY(0px)' },
			  { transform: 'rotate(0deg) scale(1) translateX(0px) translateY(0px)' }
			],
			{ duration: 600, easing: 'ease-in-out' }
		  )
		);
	  }
  
	  // Stripe slide
	  if (stripeEl) {
		currentAnimation.push(
		  stripeEl.animate(
			[
			  { transform: 'translateX(-2px)', opacity: '0.7' },
			  { transform: 'translateX(0px)', opacity: '1' }
			],
			{ duration: 400, delay: 80, easing: 'ease-out' }
		  )
		);
	  }
  
	  // Swipe line
	  if (swipeEl) {
		const pathLength = swipeEl.getTotalLength();
		swipeEl.style.strokeDasharray = pathLength + ' ' + pathLength;
		swipeEl.style.strokeDashoffset = pathLength;
  
		currentAnimation.push(
		  swipeEl.animate(
			[
			  { strokeDashoffset: pathLength, opacity: '0' },
			  { strokeDashoffset: 0, opacity: '1' },
			  { strokeDashoffset: 0, opacity: '0.9' }
			],
			{ duration: 500, delay: 180, easing: 'ease-in-out', fill: 'forwards' }
		  )
		);
	  }
  
	  // Emboss pulse
	  if (rectEl) {
		currentAnimation.push(
		  rectEl.animate(
			[
			  { transform: 'scale(1)' },
			  { transform: 'scale(1.035)' },
			  { transform: 'scale(1)' }
			],
			{ duration: 280, delay: 300, easing: 'ease-out' }
		  )
		);
	  }
  
	  setTimeout(() => {
		if (!loop && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration);
	}
  
	function stopAnimation() {
	  isAnimating = false;
	  currentAnimation.forEach((a) => a.cancel());
	  currentAnimation = [];
  
	  [groupEl, rectEl, stripeEl, swipeEl].forEach((el) => {
		el?.getAnimations().forEach((a) => a.cancel());
		if (el instanceof SVGGeometryElement) {
		  el.style.strokeDasharray = '';
		  el.style.strokeDashoffset = '';
		}
		el && (el.style.transform = '');
		el && (el.style.opacity = '1');
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
  
	// Event handlers
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
  
	// React to prop changes
	$effect(() => setAnimationState(animationState));
  
	// AutoPlay
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
	  class="lucide lucide-credit-card-icon lucide-credit-card"
	>
	  <g bind:this={groupEl} style="transform-origin: center;">
		<rect bind:this={rectEl} width="20" height="14" x="2" y="5" rx="2" />
		<line bind:this={stripeEl} x1="2" x2="22" y1="10" y2="10" />
		<path bind:this={swipeEl} d="M5 15 H15" stroke="currentColor" stroke-width="1.5" />
	  </g>
	</svg>
  </div>
  