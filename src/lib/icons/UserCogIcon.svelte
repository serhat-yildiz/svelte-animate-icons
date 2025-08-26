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
    duration = 1000,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let cogGroupEl: SVGGElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // --- Core Animation ---
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // Head pulse
    if (headEl) {
      headEl.animate(
        [
          { transform: 'scale(0.5)', opacity: '0' },
          { transform: 'scale(1.2)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Body draw
    if (bodyEl) {
      bodyEl.animate(
        [
          { strokeDashoffset: '40', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 700, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Cog spin
    if (cogGroupEl) {
      cogGroupEl.animate(
        [
          { transform: 'rotate(0deg) scale(0.8)', opacity: '1' },
          { transform: 'rotate(360deg) scale(1.1)', opacity: '1' },
          { transform: 'rotate(360deg) scale(1)', opacity: '1' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 100);
  }

  function resetAnimation() {
    if (!svgRef) return;
    svgRef.getAnimations().forEach((a) => a.cancel());
    svgRef.querySelectorAll('*').forEach((el) => {
      el.getAnimations().forEach((a) => a.cancel());
      (el as HTMLElement).style.transform = '';
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.strokeDashoffset = '';
    });
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

  // --- Event handlers ---
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
  class={clsx("inline-flex items-center justify-center", className)}
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
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style="transform-origin: center;"
  >
    <path
      bind:this={bodyEl}
      d="M10 15H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle bind:this={headEl} cx="9" cy="7" r="4" />
    <g bind:this={cogGroupEl} style="transform-origin: center;">
      <circle cx="18" cy="15" r="3" />
      <path d="m14.305 16.53.923-.382" />
      <path d="m15.228 13.852-.923-.383" />
      <path d="m16.852 12.228-.383-.923" />
      <path d="m16.852 17.772-.383.924" />
      <path d="m19.148 12.228.383-.923" />
      <path d="m19.53 18.696-.382-.924" />
      <path d="m20.772 13.852.924-.383" />
      <path d="m20.772 16.148.924.383" />
    </g>
  </svg>
</div>
