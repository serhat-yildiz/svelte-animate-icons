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
  let svgEl: SVGSVGElement;
  let lineEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // ---- Core Animations ----
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // SVG pulse
    if (svgEl) {
      svgEl.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.1)' },
          { transform: 'scale(0.9)' },
          { transform: 'scale(1)' },
        ],
        {
          duration,
          easing: 'ease-in-out',
          iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
        }
      );
    }

    // Line drawing
    if (lineEl) {
      lineEl.animate(
        [
          { strokeDashoffset: lineEl.getTotalLength(), opacity: '0.5' },
          { strokeDashoffset: '0', opacity: '1' },
        ],
        {
          duration: duration * 0.8,
          easing: 'ease-in-out',
          iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
        }
      );
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') {
        stopAnimation();
      }
      onAnimationEnd?.();
    }, duration + 100);
  }

  function stopAnimation() {
    isAnimating = false;
    [svgEl, lineEl].forEach((el) => {
      if (el) {
        el.getAnimations().forEach((a) => a.cancel());
        (el as HTMLElement).style.transform = '';
        (el as HTMLElement).style.strokeDashoffset = '';
        (el as HTMLElement).style.opacity = '1';
      }
    });
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

  // ---- Lifecycle ----
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
    bind:this={svgEl}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-line-icon"
  >
    <path
      bind:this={lineEl}
      d="M5 12h14"
      stroke-dasharray={lineEl?.getTotalLength() || 14}
      stroke-dashoffset={lineEl?.getTotalLength() || 14}
    />
  </svg>
</div>
