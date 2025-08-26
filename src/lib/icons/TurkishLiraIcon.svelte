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
  let topSlashEl: SVGPathElement;
  let midSlashEl: SVGPathElement;
  let mainStrokeEl: SVGPathElement;

  let isAnimating = $state(false);
  let currentState: AnimationState = animationState;

  // ---- Core animation ----
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    onAnimationStart?.();

    // SVG shake / pulse
    if (svgEl) {
      svgEl.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.06) rotate(-2deg)' },
          { transform: 'scale(1) rotate(2deg)' },
          { transform: 'scale(1) rotate(0deg)' }
        ],
        {
          duration,
          easing: 'ease-in-out',
          iterations: loop || autoPlay || currentState === 'loading' ? Infinity : 1
        }
      );
    }

    // Slash + stroke draws with delays
    if (topSlashEl) {
      setTimeout(() => {
        topSlashEl.animate(
          [
            { strokeDashoffset: topSlashEl.getTotalLength(), opacity: '0.7' },
            { strokeDashoffset: '0', opacity: '1' }
          ],
          { duration: 550, easing: 'ease-in-out' }
        );
      }, 60);
    }

    if (midSlashEl) {
      setTimeout(() => {
        midSlashEl.animate(
          [
            { strokeDashoffset: midSlashEl.getTotalLength(), opacity: '0.7' },
            { strokeDashoffset: '0', opacity: '1' }
          ],
          { duration: 550, easing: 'ease-in-out' }
        );
      }, 160);
    }

    if (mainStrokeEl) {
      setTimeout(() => {
        mainStrokeEl.animate(
          [
            { strokeDashoffset: mainStrokeEl.getTotalLength(), opacity: '0.8' },
            { strokeDashoffset: '0', opacity: '1' }
          ],
          { duration: 900, easing: 'ease-in-out' }
        );
      }, 260);
    }

    setTimeout(() => {
      if (!loop && currentState !== 'loading') stopAnimation();
      onAnimationEnd?.();
    }, duration + 200);
  }

  function stopAnimation() {
    isAnimating = false;
    [svgEl, topSlashEl, midSlashEl, mainStrokeEl].forEach(el => {
      if (el) {
        el.getAnimations().forEach(a => a.cancel());
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

  // ---- Reactivity ----
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
    class="lucide lucide-turkish-lira-icon lucide-turkish-lira"
  >
    <g opacity="0.35">
      <path d="M15 4 5 9" />
      <path d="m15 8.5-10 5" />
      <path d="M18 12a9 9 0 0 1-9 9V3" />
    </g>

    <path
      bind:this={topSlashEl}
      d="M15 4 5 9"
      stroke-dasharray={topSlashEl?.getTotalLength() || 12}
      stroke-dashoffset={topSlashEl?.getTotalLength() || 12}
    />
    <path
      bind:this={midSlashEl}
      d="m15 8.5-10 5"
      stroke-dasharray={midSlashEl?.getTotalLength() || 12}
      stroke-dashoffset={midSlashEl?.getTotalLength() || 12}
    />
    <path
      bind:this={mainStrokeEl}
      d="M18 12a9 9 0 0 1-9 9V3"
      stroke-dasharray={mainStrokeEl?.getTotalLength() || 30}
      stroke-dashoffset={mainStrokeEl?.getTotalLength() || 30}
    />
  </svg>
</div>
