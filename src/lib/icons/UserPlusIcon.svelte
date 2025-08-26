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

  
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let plusGroupEl: SVGGElement;

  let isAnimating = $state(false);
  let currentAnimation: Animation | null = null;
  let currentState = $state(animationState);

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    
    if (bodyEl) {
      bodyEl.animate(
        [
          { strokeDashoffset: '40', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-in-out' }
      );
    }

    
    if (headEl) {
      headEl.animate(
        [
          { transform: 'scale(0.5)', opacity: '0' },
          { transform: 'scale(1.2)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-in-out' }
      );
    }

    
    if (plusGroupEl) {
      plusGroupEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          { transform: 'scale(1.3) rotate(25deg)', opacity: '1' },
          { transform: 'scale(1) rotate(-25deg)', opacity: '1' },
          { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        ],
        { duration: 600, easing: 'ease-in-out' }
      );
    }

    setTimeout(() => {
      isAnimating = false;
      onAnimationEnd?.();
    }, 600);
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
    class="lucide lucide-user-plus"
  >
    <path
      bind:this={bodyEl}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle bind:this={headEl} cx="9" cy="7" r="4" />
    <g bind:this={plusGroupEl}>
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </g>
  </svg>
</div>
