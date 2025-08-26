<script lang="ts">
  import { clsx } from 'clsx';

  interface AnimationTriggers {
    hover?: boolean;
    click?: boolean;
    focus?: boolean;
    custom?: boolean;
  }

  type AnimationState = 'idle' | 'active' | 'loading' | 'success' | 'error';

  interface Props {
    size?: number;
    class?: string;
    triggers?: AnimationTriggers;
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

  let containerRef: HTMLDivElement;
  let svgRef: SVGSVGElement;
  let canEl: SVGPathElement;
  let lidEl: SVGPathElement;
  let handleEl: SVGPathElement;
  let smokeEl: HTMLDivElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // ---- Core animation ----
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Lid lift
    if (lidEl) {
      lidEl.animate(
        [
          { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' },
          { transform: 'translateY(-8px) rotate(-25deg)', transformOrigin: 'left center' }
        ],
        { duration: 400, easing: 'ease-out', fill: 'forwards' }
      );
    }

    // Handle same as lid
    if (handleEl) {
      handleEl.animate(
        [
          { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' },
          { transform: 'translateY(-8px) rotate(-25deg)', transformOrigin: 'left center' }
        ],
        { duration: 400, easing: 'ease-out', fill: 'forwards' }
      );
    }

    // Can shake
    if (canEl) {
      canEl.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(0.95)' },
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ],
        { duration: 500, easing: 'ease-out' }
      );
    }

    // Smoke puff
    if (smokeEl) {
      smokeEl.animate(
        [
          { opacity: '0', transform: 'scale(0) translateY(0px)' },
          { opacity: '0.6', transform: 'scale(1.5) translateY(-10px)' },
          { opacity: '0', transform: 'scale(2) translateY(-20px)' }
        ],
        { duration, easing: 'ease-out' }
      );
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') stopAnimation();
      onAnimationEnd?.();
    }, duration + 200);
  }

  function stopAnimation() {
    isAnimating = false;

    [canEl, lidEl, handleEl].forEach(el => {
      if (el) {
        el.getAnimations().forEach(a => a.cancel());
        (el as HTMLElement).style.transform = '';
      }
    });

    if (smokeEl) {
      smokeEl.getAnimations().forEach(a => a.cancel());
      smokeEl.style.opacity = '0';
    }
  }

  function toggleAnimation() {
    isAnimating ? stopAnimation() : startAnimation();
  }

  function setAnimationState(newState: AnimationState) {
    currentState = newState;
    if (newState === 'active' || newState === 'loading') startAnimation();
    else stopAnimation();
  }

  // ---- Event handlers ----
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

  // ---- Reactivity ----
  $effect(() => {
    setAnimationState(animationState);
  });

  $effect(() => {
    if (autoPlay) startAnimation();
    return () => stopAnimation();
  });

  // ---- Public API ----
  export function start() { startAnimation(); }
  export function stop() { stopAnimation(); }
  export function toggle() { toggleAnimation(); }
  export function setState(state: AnimationState) { setAnimationState(state); }
  export function getStatus() { return { isAnimating, currentState }; }
</script>

<div
  bind:this={containerRef}
  class={clsx("relative inline-flex", className)}
  style="overflow: visible;"
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
    style="overflow: visible;"
  >
    <path bind:this={canEl} d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path bind:this={lidEl} d="M3 6h18" />
    <path bind:this={handleEl} d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>

  <div
    bind:this={smokeEl}
    class="absolute top-1/2 left-1/2 pointer-events-none"
    style="transform: translate(-50%, -50%); opacity: 0;"
  >
    <div
      style="width: {size / 2}px; height: {size / 2}px; border-radius: 50%; background: rgba(128,128,128,0.4); filter: blur(2px);"
    ></div>
  </div>
</div>
