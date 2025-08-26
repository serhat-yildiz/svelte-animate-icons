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
  
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentState = $state(animationState);
	let currentAnimations: Animation[] = [];
  
	function startAnimation() {
	  if (!svgRef || isAnimating) return;
	  isAnimating = true;
	  onAnimationStart?.();
  
	  const group = svgRef.querySelector('g');
	  const leftCircle = svgRef.querySelector('circle[cx="9"]');
	  const rightCircle = svgRef.querySelector('circle[cx="15"]');
	  const overlapGroup = svgRef.querySelector('g g');
  
	  // Group wobble
	  if (group) {
		currentAnimations.push(
		  group.animate(
			[
			  { transform: 'rotate(0deg) scale(1)' },
			  { transform: 'rotate(-1.5deg) scale(1.02)' },
			  { transform: 'rotate(1.5deg) scale(1)' },
			  { transform: 'rotate(0deg) scale(1)' }
			],
			{
			  duration,
			  iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  // Left circle
	  if (leftCircle) {
		currentAnimations.push(
		  leftCircle.animate(
			[
			  { strokeDashoffset: '48', opacity: '0.45', transform: 'translateX(0px)' },
			  { strokeDashoffset: '24', opacity: '0.7', transform: 'translateX(2px)' },
			  { strokeDashoffset: '0', opacity: '1', transform: 'translateX(4px)' }
			],
			{
			  duration: duration - 100,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  // Right circle with delay
	  if (rightCircle) {
		currentAnimations.push(
		  rightCircle.animate(
			[
			  { strokeDashoffset: '48', opacity: '0.45', transform: 'translateX(0px)' },
			  { strokeDashoffset: '24', opacity: '0.7', transform: 'translateX(-2px)' },
			  { strokeDashoffset: '0', opacity: '1', transform: 'translateX(-4px)' }
			],
			{
			  duration: duration - 100,
			  delay: 60,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  // Overlap pulse
	  if (overlapGroup) {
		currentAnimations.push(
		  overlapGroup.animate(
			[
			  { transform: 'scale(1)', opacity: '0.9' },
			  { transform: 'scale(1.06)', opacity: '1' },
			  { transform: 'scale(1)', opacity: '1' }
			],
			{
			  duration: 500,
			  delay: 180,
			  easing: 'ease-in-out'
			}
		  )
		);
	  }
  
	  setTimeout(() => {
		if (!loop && !autoPlay && currentState !== 'loading') stopAnimation();
		onAnimationEnd?.();
	  }, duration + 200);
	}
  
	function stopAnimation() {
	  currentAnimations.forEach((a) => a.cancel());
	  currentAnimations = [];
	  isAnimating = false;
  
	  if (svgRef) {
		const leftCircle = svgRef.querySelector('circle[cx="9"]') as SVGCircleElement;
		const rightCircle = svgRef.querySelector('circle[cx="15"]') as SVGCircleElement;
		const group = svgRef.querySelector('g') as SVGGElement;
		const overlapGroup = svgRef.querySelector('g g') as SVGGElement;
  
		group && (group.style.transform = 'rotate(0deg) scale(1)');
		if (leftCircle) {
		  leftCircle.style.strokeDashoffset = '0';
		  leftCircle.style.transform = 'translateX(0px)';
		  leftCircle.style.opacity = '1';
		}
		if (rightCircle) {
		  rightCircle.style.strokeDashoffset = '0';
		  rightCircle.style.transform = 'translateX(0px)';
		  rightCircle.style.opacity = '1';
		}
		overlapGroup && (overlapGroup.style.transform = 'scale(1)');
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
	  class="lucide lucide-blend"
	>
	  <g style="transform-origin: center;">
		<circle cx="9" cy="9" r="7" stroke-dasharray="48" stroke-dashoffset="48" />
		<g style="transform-origin: center;">
		  <circle cx="15" cy="15" r="7" stroke-dasharray="48" stroke-dashoffset="48" />
		</g>
	  </g>
	</svg>
  </div>
  