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
    duration = 1500,
    onAnimationStart,
    onAnimationEnd,
    ...restProps
  }: Props = $props();

  let containerRef: HTMLDivElement;
  let svgEl: SVGSVGElement;
  let slashEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;
  let currentAnimation: Animation | null = null;

  
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    
    if (svgEl) {
      svgEl.animate(
        [
          { transform: 'scale(1) rotate(0deg) translateY(0px)' },
          { transform: 'scale(1.05) rotate(-3deg) translateY(-1px)' },
          { transform: 'scale(0.95) rotate(3deg) translateY(0px)' },
          { transform: 'scale(1) rotate(-2deg) translateY(0px)' },
          { transform: 'scale(1) rotate(2deg) translateY(0px)' },
          { transform: 'scale(1) rotate(0deg) translateY(0px)' },
        ],
        {
          duration,
          easing: 'ease-in-out',
          iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1,
        }
      );
    }

    
    if (slashEl) {
      slashEl.animate(
        [
          { strokeDashoffset: 0, opacity: '1' },
          { strokeDashoffset: slashEl.getTotalLength(), opacity: '1' },
          { strokeDashoffset: 0, opacity: '1' },
        ],
        {
          duration: duration * 0.8,
          easing: 'ease-in-out',
          iterations: loop || autoPlay ? Infinity : 1,
        }
      );
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') {
        stopAnimation();
      }
      onAnimationEnd?.();
    }, duration + 200);
  }

  function stopAnimation() {
    isAnimating = false;
    [svgEl, slashEl].forEach((el) => {
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
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-mic-off-icon lucide-mic-off"
  >
    <path d="M12 19v3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <rect x="9" y="2" width="6" height="13" rx="3" />
    <path
      bind:this={slashEl}
      d="M2 2L22 22"
      stroke-dasharray={slashEl?.getTotalLength() || 28}
      stroke-dashoffset="0"
    />
  </svg>
</div>
