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
    duration = 500,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let headEl: SVGCircleElement;
  let bodyEl: SVGPathElement;
  let lockPathEl: SVGPathElement;
  let lockRectEl: SVGRectElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    
    [headEl, bodyEl].forEach((el) => {
      if (el) {
        el.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.05)' },
            { transform: 'scale(1)' }
          ],
          { duration: 400, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
        );
      }
    });

    
    [lockPathEl, lockRectEl].forEach((el) => {
      if (el) {
        el.animate(
          [
            { transform: 'translateX(0px) rotate(0deg)' },
            { transform: 'translateX(-2px) rotate(-3deg)' },
            { transform: 'translateX(2px) rotate(3deg)' },
            { transform: 'translateX(-2px) rotate(-3deg)' },
            { transform: 'translateX(2px) rotate(3deg)' },
            { transform: 'translateX(0px) rotate(0deg)' }
          ],
          { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
        );
      }
    });

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
    });
  }

  
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

  
  $effect(() => setState(animationState));
  $effect(() => {
    if (autoPlay) start();
    return () => stop();
  });
</script>

<div
  class={clsx("inline-flex", className)}
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
    <circle bind:this={headEl} cx="10" cy="7" r="4" />
    <path bind:this={bodyEl} d="M10.3 15H7a4 4 0 0 0-4 4v2" />
    <path bind:this={lockPathEl} d="M15 15.5V14a2 2 0 0 1 4 0v1.5" />
    <rect bind:this={lockRectEl} width="8" height="5" x="13" y="16" rx=".899" />
  </svg>
</div>
