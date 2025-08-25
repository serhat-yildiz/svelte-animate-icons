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
  let canEl: SVGPathElement;
  let lidEl: SVGPathElement;
  let handleEl: SVGPathElement;
  let smokeEl: HTMLDivElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Lid animation - lift and rotate
    if (lidEl) {
      lidEl.animate([
        { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' },
        { transform: 'translateY(-8px) rotate(-25deg)', transformOrigin: 'left center' }
      ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
      });
    }
    
    // Handle animation - same as lid
    if (handleEl) {
      handleEl.animate([
        { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' },
        { transform: 'translateY(-8px) rotate(-25deg)', transformOrigin: 'left center' }
      ], {
        duration: 400,
        easing: 'ease-out',
        fill: 'forwards'
      });
    }
    
    // Can shake animation
    if (canEl) {
      canEl.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1.05)' },
        { transform: 'scale(1)' }
      ], {
        duration: 500,
        easing: 'ease-out'
      });
    }
    
    // Smoke effect
    if (smokeEl) {
      smokeEl.animate([
        { opacity: '0', transform: 'scale(0) translateY(0px)' },
        { opacity: '0.6', transform: 'scale(1.5) translateY(-10px)' },
        { opacity: '0', transform: 'scale(2) translateY(-20px)' }
      ], {
        duration: 1000,
        easing: 'ease-out'
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    
    // Return lid to normal position
    if (lidEl) {
      lidEl.animate([
        { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' }
      ], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
    }
    
    // Return handle to normal position
    if (handleEl) {
      handleEl.animate([
        { transform: 'translateY(0px) rotate(0deg)', transformOrigin: 'left center' }
      ], {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards'
      });
    }
  }
  
  function handleMouseEnter() {
    startAnimation();
  }
  
  function handleMouseLeave() {
    stopAnimation();
  }
</script>

<div 
  class={clsx("relative inline-flex", className)} 
  style="overflow: visible;"
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
    style="overflow: visible;"
  >
    <path
      bind:this={canEl}
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      stroke="currentColor"
    />
    <path
      bind:this={lidEl}
      d="M3 6h18"
      stroke="currentColor"
    />
    <path
      bind:this={handleEl}
      d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      stroke="currentColor"
    />
  </svg>

  <div
    bind:this={smokeEl}
    class="absolute top-1/2 left-1/2 pointer-events-none"
    style="transform: translate(-50%, -50%); opacity: 0;"
  >
    <div
      style="width: {size / 2}px; height: {size / 2}px; border-radius: 50%; background: rgba(128,128,128,0.4); filter: blur(2px);"
    ></div>
  </div>
</div>
