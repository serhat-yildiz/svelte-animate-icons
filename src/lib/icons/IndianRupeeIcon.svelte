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
    duration = 1200,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let groupEl: SVGGElement;
  let topLineEl: SVGPathElement;
  let midLineEl: SVGPathElement;
  let curveEl: SVGPathElement;
  let notchEl: SVGPathElement;
  let diagonalEl: SVGPathElement;

  let currentState: AnimationState = animationState;
  let isAnimating = $state(false);

  // ---- Core Animations ----
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // Group wiggle
    groupEl?.animate(
      [
        { transform: 'scale(1) translate(0,0)' },
        { transform: 'scale(1.05) translate(-1px,-1px)' },
        { transform: 'scale(1) translate(0,0)' },
      ],
      { duration: 600, easing: 'cubic-bezier(0.12,1,0.25,1)' }
    );

    const draw = (el: SVGPathElement | null, delay: number, d = duration * 0.5) => {
      if (!el) return;
      const len = el.getTotalLength();
      el.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: d, delay, easing: 'cubic-bezier(0.12,1,0.25,1)', fill: 'forwards' }
      );
    };

    draw(topLineEl, 60, 500);
    draw(midLineEl, 160, 500);
    draw(curveEl, 260, 800);
    draw(notchEl, 420, 450);

    // diagonal special animation
    if (diagonalEl) {
      const len = diagonalEl.getTotalLength();
      diagonalEl.animate(
        [
          { strokeDashoffset: len, transform: 'translate(-0.3px,-0.2px)', opacity: '1' },
          { strokeDashoffset: 0, transform: 'translate(0.5px,0.5px) scale(1.05)', opacity: '1' },
          { strokeDashoffset: 0, transform: 'translate(0,0) scale(1)', opacity: '1' },
        ],
        { duration: 600, delay: 500, easing: 'cubic-bezier(0.12,1,0.25,1)', fill: 'forwards' }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 600);
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

  // ---- Public API ----
  export function start() {
    if (!isAnimating) {
      currentState = 'active';
      runAnimation();
    }
  }
  export function stop() {
    resetAnimation();
    currentState = 'idle';
    isAnimating = false;
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

  // ---- Event handlers ----
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

  // ---- Reactivity ----
  $effect(() => {
    setState(animationState);
  });

  $effect(() => {
    if (autoPlay) start();
    return () => stop();
  });
</script>

<div
  class={clsx('inline-flex items-center justify-center', className)}
  on:mouseenter={handleMouseEnter}
  on:mouseleave={handleMouseLeave}
  on:click={handleClick}
  on:focus={handleFocus}
  on:blur={handleBlur}
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
    class="lucide lucide-indian-rupee-icon lucide-indian-rupee"
  >
    <g bind:this={groupEl}>
      <g opacity="0.3">
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="M9 13c6.667 0 6.667-10 0-10" />
        <path d="M6 13h3" />
        <path d="m6 13 8.5 8" />
      </g>
      <path bind:this={topLineEl} d="M6 3h12" />
      <path bind:this={midLineEl} d="M6 8h12" />
      <path bind:this={curveEl} d="M9 13c6.667 0 6.667-10 0-10" />
      <path bind:this={notchEl} d="M6 13h3" />
      <path bind:this={diagonalEl} d="m6 13 8.5 8" />
    </g>
  </svg>
</div>
