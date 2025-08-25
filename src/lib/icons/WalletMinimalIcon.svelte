<script lang="ts">
  import { clsx } from 'clsx';
  
  interface Props {
    size?: number;
    class?: string;
  }
  
  let { size = 28, class: className, ...restProps }: Props = $props();
  
  // Animation control
  let isAnimating = $state(false);
  
  // Refs for animation elements
  let wrapperEl: SVGGElement;
  let outlineEl: SVGPathElement;
  let dotEl: SVGPathElement;
  let latchEl: SVGPathElement;
  let shimmerEl: SVGRectElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Wrapper rotation and scale animation
    if (wrapperEl) {
      wrapperEl.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-2deg) scale(1.02)' },
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-1deg) scale(1)' },
        { transform: 'rotate(0deg) scale(1)' }
      ], {
        duration: 900,
        easing: 'ease-in-out'
      });
    }
    
    // Outline drawing animation
    if (outlineEl) {
      outlineEl.animate([
        { strokeDashoffset: '120', opacity: '0.4' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Dot pop animation (delayed)
    if (dotEl) {
      setTimeout(() => {
        dotEl.animate([
          { transform: 'scale(0.7)', opacity: '0' },
          { transform: 'scale(1.25)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ], {
          duration: 450,
          easing: 'ease-out'
        });
      }, 400);
    }
    
    // Latch snap animation (delayed)
    if (latchEl) {
      setTimeout(() => {
        latchEl.animate([
          { transform: 'translateX(0px)', opacity: '0' },
          { transform: 'translateX(3px)', opacity: '1' },
          { transform: 'translateX(0px)', opacity: '0' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 500);
    }
    
    // Shimmer effect (delayed)
    if (shimmerEl) {
      setTimeout(() => {
        shimmerEl.animate([
          { transform: 'translateX(-18px)', opacity: '0' },
          { transform: 'translateX(22px)', opacity: '0.35' },
          { transform: 'translateX(22px)', opacity: '0' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 250);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1300);
  }
  
  export function stopAnimation() {
    isAnimating = false;
  }
  
  function handleMouseEnter() {
    startAnimation();
  }
  
  function handleMouseLeave() {
    stopAnimation();
  }
</script>

<div 
  class={clsx("inline-flex items-center justify-center", className)} 
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
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
    class="lucide lucide-wallet-minimal-icon lucide-wallet-minimal"
  >
    <g bind:this={wrapperEl}>
      <defs>
        <linearGradient id="wm-shimmer" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0" />
          <stop offset="50%" stop-color="currentColor" stop-opacity="0.35" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>

      <path
        bind:this={outlineEl}
        d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"
        stroke-dasharray="120"
        stroke-dashoffset="120"
      />

      <path
        bind:this={dotEl}
        d="M17 14h.01"
      />

      <path
        bind:this={latchEl}
        d="M17 14h.01"
      />

      <rect
        bind:this={shimmerEl}
        x="2"
        y="4"
        width="20"
        height="16"
        rx="3"
        fill="url(#wm-shimmer)"
        style="pointer-events: none;"
      />
    </g>
  </svg>
</div>
