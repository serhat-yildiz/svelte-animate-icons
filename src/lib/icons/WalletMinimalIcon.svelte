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
    duration = 1200,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  export interface WalletMinimalIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
    toggleAnimation: () => void;
    setAnimationState: (newState: string) => void;
    readonly isAnimating: boolean;
  }

  let containerRef: HTMLDivElement;
  let svgRef: SVGSVGElement;
  let wrapperEl: SVGGElement;
  let outlineEl: SVGPathElement;
  let dotEl: SVGPathElement;
  let latchEl: SVGPathElement;
  let shimmerEl: SVGRectElement;

  let isAnimating = $state(false);
  let currentState = $state(animationState);

  // --- Animation Controls ---
  function startAnimation() {
    if (!svgRef || isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Wrapper rotate + scale
    wrapperEl?.animate(
      [
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-2deg) scale(1.02)' },
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-1deg) scale(1)' },
        { transform: 'rotate(0deg) scale(1)' }
      ],
      { duration: 900, easing: 'ease-in-out' }
    );

    // Outline
    outlineEl?.animate(
      [
        { strokeDashoffset: '120', opacity: '0.4' },
        { strokeDashoffset: '0', opacity: '1' }
      ],
      { duration: 800, easing: 'ease-in-out' }
    );

    // Dot pop
    if (dotEl) {
      setTimeout(() => {
        dotEl.animate(
          [
            { transform: 'scale(0.7)', opacity: '0' },
            { transform: 'scale(1.25)', opacity: '1' },
            { transform: 'scale(1)', opacity: '1' }
          ],
          { duration: 450, easing: 'ease-out' }
        );
      }, 400);
    }

    // Latch snap
    if (latchEl) {
      setTimeout(() => {
        latchEl.animate(
          [
            { transform: 'translateX(0px)', opacity: '0' },
            { transform: 'translateX(3px)', opacity: '1' },
            { transform: 'translateX(0px)', opacity: '0' }
          ],
          { duration: 500, easing: 'ease-in-out' }
        );
      }, 500);
    }

    // Shimmer
    if (shimmerEl) {
      setTimeout(() => {
        shimmerEl.animate(
          [
            { transform: 'translateX(-18px)', opacity: '0' },
            { transform: 'translateX(22px)', opacity: '0.35' },
            { transform: 'translateX(22px)', opacity: '0' }
          ],
          { duration: 800, easing: 'ease-in-out' }
        );
      }, 250);
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') stopAnimation();
      onAnimationEnd?.();
    }, duration);
  }

  function stopAnimation() {
    isAnimating = false;
    svgRef?.getAnimations().forEach((a) => a.cancel());
    [wrapperEl, outlineEl, dotEl, latchEl, shimmerEl].forEach((el) =>
      el?.getAnimations().forEach((a) => a.cancel())
    );
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

  // --- Event handlers ---
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

  // --- Reactive props ---
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
    class="lucide lucide-wallet-minimal-icon lucide-wallet-minimal"
  >
    <g bind:this={wrapperEl}>
      <defs>
        <linearGradient id="wm-shimmer" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0" />
          <stop offset="50%" stop-color="currentColor" stop-opacity="0.35" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path
        bind:this={outlineEl}
        d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"
        stroke-dasharray="120"
        stroke-dashoffset="120"
      />

      <path bind:this={dotEl} d="M17 14h.01" />
      <path bind:this={latchEl} d="M17 14h.01" />

      <rect
        bind:this={shimmerEl}
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        fill="url(#wm-shimmer)"
        style="pointer-events: none;"
      />
    </g>
  </svg>
</div>
