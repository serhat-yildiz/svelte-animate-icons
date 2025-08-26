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
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let crossGroupEl: SVGGElement;
  let crossLine1El: SVGPathElement;
  let crossLine2El: SVGPathElement;

  let isAnimating = $state(false);
  let currentAnimation: Animation | null = null;
  let currentState = $state(animationState);

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Body
    if (bodyEl) {
      bodyEl.animate(
        [
          { strokeDashoffset: '60', opacity: '0.3' },
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

    // Cross group
    if (crossGroupEl) {
      crossGroupEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          { transform: 'scale(1.3) rotate(-10deg)', opacity: '1' },
          { transform: 'scale(1) rotate(10deg)', opacity: '1' },
          { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-in-out' }
      );
    }

    // Cross lines
    [crossLine1El, crossLine2El].forEach((line) => {
      if (line) {
        line.animate(
          [
            { strokeDashoffset: '20' },
            { strokeDashoffset: '0' }
          ],
          { duration: 500, easing: 'ease-in-out' }
        );
      }
    });

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
    }, 700);
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
    class="lucide lucide-user-round-x"
  >
    <path
      bind:this={bodyEl}
      d="M2 21a8 8 0 0 1 11.873-7"
      stroke-dasharray="60"
      stroke-dashoffset="60"
    />
    <circle bind:this={headEl} cx="10" cy="8" r="5" />
    <g bind:this={crossGroupEl}>
      <path
        bind:this={crossLine1El}
        d="m17 17 5 5"
        stroke-dasharray="20"
        stroke-dashoffset="20"
      />
      <path
        bind:this={crossLine2El}
        d="m22 17-5 5"
        stroke-dasharray="20"
        stroke-dashoffset="20"
      />
    </g>
  </svg>
</div>
