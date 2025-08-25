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
  let arrowEl: SVGPathElement;
  let lineEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Arrow movement animation (continuous)
    if (arrowEl) {
      arrowEl.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(0px)' }
      ], {
        duration: 600,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Line opacity animation (continuous)
    if (lineEl) {
      lineEl.animate([
        { opacity: '1' },
        { opacity: '0.5' },
        { opacity: '1' }
      ], {
        duration: 800,
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [arrowEl, lineEl].forEach(el => {
      if (el) {
        el.getAnimations().forEach(animation => animation.finish());
      }
    });
  }
  
  function handleMouseEnter() {
    startAnimation();
  }
  
  function handleMouseLeave() {
    stopAnimation();
  }
</script>

<div 
  class={clsx("inline-flex", className)} 
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
  >
    <path
      bind:this={arrowEl}
      d="M6 8L2 12L6 16"
      stroke="currentColor"
    />
    <path
      bind:this={lineEl}
      d="M2 12H22"
      stroke="currentColor"
    />
  </svg>
</div>
