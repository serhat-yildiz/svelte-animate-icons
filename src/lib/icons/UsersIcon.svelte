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
    duration = 2000,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let containerRef: HTMLDivElement;
  let svgRef: SVGSVGElement;

  // refs
  let arcEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let sideArc1El: SVGPathElement;
  let sideArc2El: SVGPathElement;

  let isAnimating = $state(false);
  let currentAnimation: Animation | null = null;
  let currentState = $state(animationState);

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Main arc
    if (arcEl) {
      arcEl.animate(
        [
          { strokeDashoffset: '50', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 700, easing: 'ease-in-out' }
      );
    }

    // Head
    if (headEl) {
      headEl.animate(
        [
          { transform: 'scale(0.6)', opacity: '0' },
          { transform: 'scale(1.2)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-out' }
      );
    }

    // Side arcs (delayed)
    [sideArc1El, sideArc2El].forEach((arc) => {
      if (arc) {
        setTimeout(() => {
          arc.animate(
            [
              { strokeDashoffset: '40', opacity: '0.2' },
              { strokeDashoffset: '0', opacity: '1' }
            ],
            { duration: 700, easing: 'ease-in-out' }
          );
        }, 300);
      }
    });

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
    }, 1000);
  }

  function stopAnimation() {
    if (currentAnimation) {
      currentAnimation.cancel();
      currentAnimation = null;
    }
    isAnimating = false;
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
  class={clsx("inline-flex", className)}
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
    class="lucide lucide-users"
  >
    <path
      bind:this={arcEl}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="50"
      stroke-dashoffset="50"
    />
    <path
      bind:this={sideArc1El}
      d="M16 3.128a4 4 0 0 1 0 7.744"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <path
      bind:this={sideArc2El}
      d="M22 21v-2a4 4 0 0 0-3-3.87"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle bind:this={headEl} cx="9" cy="7" r="4" />
  </svg>
</div>
