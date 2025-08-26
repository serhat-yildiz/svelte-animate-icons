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
    duration = 800,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let leftChainEl: SVGPathElement;
  let rightChainEl: SVGPathElement;
  let sparks: SVGLineElement[] = [];

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // --- Core animation ---
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    // Left chain
    if (leftChainEl) {
      leftChainEl.animate(
        [
          { transform: 'translateX(0px) rotate(0deg)' },
          { transform: 'translateX(-2px) rotate(-5deg)' },
          { transform: 'translateX(-4px) rotate(-8deg)' },
          { transform: 'translateX(-2px) rotate(-5deg)' },
          { transform: 'translateX(0px) rotate(0deg)' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Right chain
    if (rightChainEl) {
      rightChainEl.animate(
        [
          { transform: 'translateX(0px) rotate(0deg)' },
          { transform: 'translateX(2px) rotate(5deg)' },
          { transform: 'translateX(4px) rotate(8deg)' },
          { transform: 'translateX(2px) rotate(5deg)' },
          { transform: 'translateX(0px) rotate(0deg)' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    // Sparks
    sparks.forEach((spark, i) => {
      if (spark) {
        spark.animate(
          [
            { strokeDashoffset: spark.getTotalLength(), opacity: '0' },
            { strokeDashoffset: '0', opacity: '1' },
            { strokeDashoffset: '0', opacity: '0' }
          ],
          { duration: duration * 0.6, delay: i * 80, easing: 'ease-in-out' }
        );
      }
    });

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
    <path
      bind:this={rightChainEl}
      d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
    />
    <path
      bind:this={leftChainEl}
      d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
    />

    <line
      bind:this={sparks[0]}
      x1="8" x2="8" y1="2" y2="5"
      stroke-dasharray={sparks[0]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[0]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[1]}
      x1="2" x2="5" y1="8" y2="8"
      stroke-dasharray={sparks[1]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[1]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[2]}
      x1="16" x2="16" y1="19" y2="22"
      stroke-dasharray={sparks[2]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[2]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[3]}
      x1="19" x2="22" y1="16" y2="16"
      stroke-dasharray={sparks[3]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[3]?.getTotalLength() || 3}
    />
  </svg>
</div>
