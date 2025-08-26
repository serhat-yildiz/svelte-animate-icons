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
    duration = 700,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let minusEl: SVGLineElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // --- Core Animation ---
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // Head
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

    // Body
    if (bodyEl) {
      bodyEl.animate(
        [
          { strokeDashoffset: '40', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration, delay: 200, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Minus
    if (minusEl) {
      minusEl.animate(
        [
          { strokeDashoffset: '20', opacity: '0.4' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 500, delay: 600, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 800);
  }

  function resetAnimation() {
    if (!svgRef) return;
    svgRef.getAnimations().forEach(a => a.cancel());
    svgRef.querySelectorAll('*').forEach(el => {
      el.getAnimations().forEach(a => a.cancel());
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

  // --- Event Handlers ---
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
  $effect(() => {
    setState(animationState);
  });
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
    class="lucide lucide-user-minus-icon lucide-user-minus"
    style="transform-origin: center;"
  >
    <path
      bind:this={bodyEl}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle bind:this={headEl} cx="9" cy="7" r="4" />
    <line
      bind:this={minusEl}
      x1="22"
      x2="16"
      y1="11"
      y2="11"
      stroke-dasharray="20"
      stroke-dashoffset="20"
    />
  </svg>
</div>
