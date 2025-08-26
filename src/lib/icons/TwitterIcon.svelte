<script lang="ts">
  import { clsx } from 'clsx';

  type AnimationState = 'idle' | 'active' | 'loading' | 'success' | 'error';

  interface Props {
    size?: number;
    class?: string;
    triggers?: { hover?: boolean; click?: boolean; focus?: boolean; custom?: boolean };
    animationState?: AnimationState;
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
    duration = 1300,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let pathRef: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // --- Core animation ---
  function runAnimation() {
    if (!svgRef || !pathRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // SVG wiggle
    svgRef.animate(
      [
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.1) rotate(-3deg)' },
        { transform: 'scale(0.95) rotate(3deg)' },
        { transform: 'scale(1) rotate(-2deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ],
      { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
    );

    // Path drawing
    const len = pathRef.getTotalLength();
    pathRef.style.strokeDasharray = `${len}`;
    pathRef.animate(
      [
        { strokeDashoffset: len, opacity: '0.8' },
        { strokeDashoffset: 0, opacity: '1' }
      ],
      { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
    );

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 50);
  }

  function resetAnimation() {
    if (!svgRef) return;
    svgRef.getAnimations().forEach((a) => a.cancel());
    pathRef?.getAnimations().forEach((a) => a.cancel());

    if (pathRef) {
      pathRef.style.strokeDasharray = '';
      pathRef.style.strokeDashoffset = '';
      pathRef.style.opacity = '1';
    }
    svgRef.style.transform = '';
  }

  // --- Public API ---
  export function start() {
    if (!isAnimating) {
      currentState = 'active';
      runAnimation();
    }
  }
  export function stop() {
    resetAnimation();
    isAnimating = false;
    currentState = 'idle';
  }
  export function toggle() {
    isAnimating ? stop() : start();
  }
  export function setState(state: AnimationState) {
    currentState = state;
    if (state === 'active' || state === 'loading') start();
    else stop();
  }
  export function getStatus() {
    return { state: currentState, isAnimating };
  }

  // --- Events ---
  function handleMouseEnter() {
    if (triggers.hover && !triggers.custom) start();
  }
  function handleMouseLeave() {
    if (triggers.hover && !triggers.custom) stop();
  }
  function handleClick() {
    if (triggers.click) toggle();
  }
  function handleFocus() {
    if (triggers.focus) start();
  }
  function handleBlur() {
    if (triggers.focus) stop();
  }

  // --- Reactivity ---
  $effect(() => setState(animationState));
  $effect(() => {
    if (autoPlay) start();
    return () => stop();
  });
</script>

<div
  class={clsx("inline-flex", className)}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={handleClick}
  on:focus={handleFocus}
  on:blur={handleBlur}
  tabindex={triggers.focus ? 0 : -1}
  role={triggers.click || triggers.focus ? "button" : undefined}
  {...restProps}
>
  <svg
    bind:this={svgRef}
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    fill="currentColor"
    viewBox="0 0 512 512"
    height={size}
    width={size}
    style="transform-origin: center;"
  >
    <path
      bind:this={pathRef}
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 
         106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 
         389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
    />
  </svg>
</div>
