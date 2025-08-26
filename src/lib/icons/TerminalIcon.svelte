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
    duration = 600,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let lineEl: SVGPathElement;
  let chevronEl: SVGPathElement;
  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    
    if (lineEl) {
      lineEl.animate(
        [
          { transform: 'scaleX(1)', transformOrigin: 'left' },
          { transform: 'scaleX(0.3)', transformOrigin: 'left' },
          { transform: 'scaleX(1)', transformOrigin: 'left' }
        ],
        { duration, easing: 'ease-in-out' }
      );
    }

    
    if (chevronEl) {
      chevronEl.animate(
        [
          { transform: 'translateX(0px)', opacity: '1' },
          { transform: 'translateX(-2px)', opacity: '0.6' },
          { transform: 'translateX(0px)', opacity: '1' }
        ],
        {
          duration: 500,
          delay: 200,
          easing: 'ease-in-out',
          iterations: loop || currentState === 'loading' ? Infinity : 1
        }
      );
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') stopAnimation();
      onAnimationEnd?.();
    }, duration + 500);
  }

  function stopAnimation() {
    isAnimating = false;
    [lineEl, chevronEl].forEach(el => {
      if (el) el.getAnimations().forEach(a => a.cancel());
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
    setAnimationState(animationState);
  });

  $effect(() => {
    if (autoPlay) startAnimation();
    return () => stopAnimation();
  });

  
  export function start() { startAnimation(); }
  export function stop() { stopAnimation(); }
  export function toggle() { toggleAnimation(); }
  export function setState(state: AnimationState) { setAnimationState(state); }
  export function getStatus() { return { isAnimating, currentState }; }
</script>

<div 
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
    <path bind:this={lineEl} d="M12 19h8" />
    <path bind:this={chevronEl} d="m4 17 6-6-6-6" />
  </svg>
</div>
