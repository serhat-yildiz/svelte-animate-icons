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

  // Element refs for wallet animation
  let bodyEl: SVGPathElement;
  let flapGroupEl: SVGGElement;
  let swipeEl: SVGLineElement;

  let isAnimating = $state(false);
  let currentAnimation: Animation | null = null;
  let currentState = $state(animationState);

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Body drawing
    if (bodyEl) {
      bodyEl.animate(
        [
          { strokeDashoffset: '80', opacity: '0.4' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 800, easing: 'ease-in-out' }
      );
    }

    // Flap rotation
    if (flapGroupEl) {
      setTimeout(() => {
        flapGroupEl.animate(
          [
            { transform: 'rotate(0deg)', transformOrigin: '10% 50%' },
            { transform: 'rotate(-6deg)', transformOrigin: '10% 50%' },
            { transform: 'rotate(0deg)', transformOrigin: '10% 50%' },
            { transform: 'rotate(-3deg)', transformOrigin: '10% 50%' },
            { transform: 'rotate(0deg)', transformOrigin: '10% 50%' }
          ],
          { duration: 900, easing: 'ease-in-out' }
        );
      }, 200);
    }

    // Swipe line
    if (swipeEl) {
      setTimeout(() => {
        swipeEl.animate(
          [
            { transform: 'translateX(0px)', opacity: '0' },
            { transform: 'translateX(6px)', opacity: '1' },
            { transform: 'translateX(0px)', opacity: '0' }
          ],
          { duration: 800, easing: 'ease-in-out' }
        );
      }, 450);
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
    }, 1300);
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
    class="lucide lucide-wallet"
  >
    <path
      bind:this={bodyEl}
      d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
      stroke-dasharray="80"
      stroke-dashoffset="80"
    />
    <g bind:this={flapGroupEl}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    </g>
    <line bind:this={swipeEl} x1="14" y1="12" x2="18" y2="12" />
  </svg>
</div>
