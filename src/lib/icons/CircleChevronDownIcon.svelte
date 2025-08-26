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
    size = 32,
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

  let containerRef: HTMLDivElement;
  let svgRef: SVGSVGElement;
  let circleEl: SVGCircleElement;
  let arrowEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState = $state(animationState);
  let currentAnimations: Animation[] = [];

  function startAnimation() {
    if (!svgRef || isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // Circle pulse
    if (circleEl) {
      currentAnimations.push(
        circleEl.animate(
          [
            { transform: 'scale(1)', opacity: '1' },
            { transform: 'scale(1.1)', opacity: '1' },
            { transform: 'scale(0.9)', opacity: '1' },
            { transform: 'scale(1.05)', opacity: '1' },
            { transform: 'scale(1)', opacity: '1' }
          ],
          { duration, easing: 'ease-in-out' }
        )
      );
    }

    // Arrow slide-in
    if (arrowEl) {
      currentAnimations.push(
        arrowEl.animate(
          [
            { transform: 'translateY(-10px)', opacity: '0' },
            { transform: 'translateY(0px)', opacity: '1' }
          ],
          { duration: duration / 2, easing: 'ease-out' }
        )
      );
    }

    if (!loop && !autoPlay && currentState !== 'loading') {
      setTimeout(() => stopAnimation(), duration + 200);
    }

    onAnimationEnd?.();
  }

  function stopAnimation() {
    currentAnimations.forEach((a) => a.cancel());
    currentAnimations = [];
    isAnimating = false;

    if (circleEl) {
      circleEl.style.transform = 'scale(1)';
      circleEl.style.opacity = '1';
    }
    if (arrowEl) {
      arrowEl.style.transform = 'translateY(0px)';
      arrowEl.style.opacity = '1';
    }
  }

  function toggleAnimation() {
    isAnimating ? stopAnimation() : startAnimation();
  }

  function setAnimationState(newState: string) {
    currentState = newState as any;
    switch (newState) {
      case 'active':
      case 'loading':
      case 'success':
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
  class={clsx('inline-flex', className)}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  onfocus={triggers.focus ? handleFocus : undefined}
  onblur={triggers.focus ? handleBlur : undefined}
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
  >
    <circle bind:this={circleEl} cx="12" cy="12" r="10" />
    <path bind:this={arrowEl} d="m16 10-4 4-4-4" />
  </svg>
</div>
