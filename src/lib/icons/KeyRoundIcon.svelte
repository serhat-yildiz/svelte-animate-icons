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
  let groupEl: SVGGElement;
  let keyPathEl: SVGPathElement;
  let headCircleEl: SVGCircleElement;
  let biteGroupEl: SVGGElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  
  function runAnimation() {
    if (!svgRef) return;
    isAnimating = true;
    onAnimationStart?.();

    
    if (groupEl) {
      groupEl.animate(
        [
          { transform: 'rotate(0deg) scale(1)' },
          { transform: 'rotate(-2deg) scale(1.02)' },
          { transform: 'rotate(2deg) scale(1.02)' },
          { transform: 'rotate(0deg) scale(1)' }
        ],
        { duration: 700, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (keyPathEl) {
      keyPathEl.animate(
        [
          { strokeDashoffset: '140', opacity: '0.4' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (headCircleEl) {
      headCircleEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1.12) rotate(-8deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1.12) rotate(8deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '16.5px 7.5px' }
        ],
        { duration: 600, delay: 450, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    
    if (biteGroupEl) {
      biteGroupEl.animate(
        [
          { transform: 'translate(0px, 0px)' },
          { transform: 'translate(1.2px, -0.6px)' },
          { transform: 'translate(0px, 0px)' }
        ],
        { duration: 450, delay: 550, easing: 'ease-in-out', iterations: loop ? Infinity : 1 }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
      if (!loop) currentState = 'idle';
    }, duration + 600);
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
    class="lucide lucide-key-round-icon lucide-key-round"
    style="transform-origin: center;"
  >
    <g bind:this={groupEl} style="transform-origin: center;">
      <path
        bind:this={keyPathEl}
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
        stroke-dasharray="140"
        stroke-dashoffset="140"
      />
      <g bind:this={biteGroupEl}>
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172" />
      </g>
      <circle bind:this={headCircleEl} cx="16.5" cy="7.5" r=".5" fill="currentColor" />
    </g>
  </svg>
</div>
