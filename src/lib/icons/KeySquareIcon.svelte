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
    duration = 600,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let svgRef: SVGSVGElement;
  let groupEl: SVGGElement;
  let linkPathEl: SVGPathElement;
  let miniLinkEl: SVGPathElement;
  let toothEl: SVGPathElement;
  let sparkEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    
    if (groupEl) {
      groupEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.03) rotate(-3deg)' },
          { transform: 'scale(0.995) rotate(1deg)' },
          { transform: 'scale(1) rotate(0deg)' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (linkPathEl) {
      linkPathEl.animate(
        [
          { strokeDashoffset: linkPathEl.getTotalLength(), opacity: '0.6' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 500, delay: 50, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (toothEl) {
      toothEl.animate(
        [
          { transform: 'translate(0.4px, 0px)', opacity: '0.5' },
          { transform: 'translate(0px, -0.4px)', opacity: '1' },
          { transform: 'translate(0px, 0px)', opacity: '1' }
        ],
        { duration: 450, delay: 120, easing: 'ease-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (miniLinkEl) {
      miniLinkEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '12px 12px' },
          { transform: 'scale(1.06) rotate(-10deg)', transformOrigin: '12px 12px' },
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '12px 12px' }
        ],
        { duration: 500, delay: 180, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (sparkEl) {
      sparkEl.animate(
        [
          { strokeDashoffset: sparkEl.getTotalLength(), opacity: '0' },
          { strokeDashoffset: '0', opacity: '1' },
          { strokeDashoffset: '0', opacity: '0' }
        ],
        { duration: 400, delay: 360, easing: 'ease-out', iterations: loop ? Infinity : 1 }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 500);
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
    class="lucide lucide-key-square-icon lucide-key-square"
    style="transform-origin: center;"
  >
    <g bind:this={groupEl} style="transform-origin: center;">
      <path
        bind:this={linkPathEl}
        d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"
        stroke-dasharray="100"
        stroke-dashoffset="100"
      />
      <path bind:this={miniLinkEl} d="m14 7 3 3" />
      <path
        bind:this={toothEl}
        d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"
      />
      <path
        bind:this={sparkEl}
        d="M10.1 13.9 L12.2 12.2"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-dasharray="10"
        stroke-dashoffset="10"
      />
    </g>
  </svg>
</div>
