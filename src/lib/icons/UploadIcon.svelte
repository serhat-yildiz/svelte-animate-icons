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
    duration = 600,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let shaftEl: SVGPathElement;
  let headEl: SVGPathElement;
  let trayEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // --- Core animation ---
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // Group pulse
    svgRef.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.02)' },
        { transform: 'scale(1)' }
      ],
      { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
    );

    // Shaft
    if (shaftEl) {
      shaftEl.animate(
        [
          { strokeDashoffset: '30', opacity: '0.4' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Head
    if (headEl) {
      headEl.animate(
        [
          { transform: 'translateY(2px) scale(1)', opacity: '0.6' },
          { transform: 'translateY(-2px) scale(1.05)', opacity: '1' },
          { transform: 'translateY(0px) scale(1)', opacity: '1' }
        ],
        {
          duration,
          delay: 50,
          easing: 'ease-in-out',
          iterations: loop ? Infinity : 1
        }
      );
    }

    // Tray
    if (trayEl) {
      trayEl.animate(
        [
          { strokeDashoffset: '60', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        {
          duration,
          delay: 100,
          easing: 'ease-in-out',
          iterations: loop ? Infinity : 1
        }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 200);
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
      bind:this={shaftEl}
      d="M12 3v12"
      stroke-dasharray="30"
      stroke-dashoffset="30"
    />
    <path
      bind:this={headEl}
      d="m17 8-5-5-5 5"
    />
    <path
      bind:this={trayEl}
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      stroke-dasharray="60"
      stroke-dashoffset="60"
    />
  </svg>
</div>
