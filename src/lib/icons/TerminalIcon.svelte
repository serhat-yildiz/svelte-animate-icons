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
  let lineEl: SVGPathElement;
  let chevronEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Line scale animation
    if (lineEl) {
      lineEl.animate([
        { transform: 'scaleX(1)', transformOrigin: 'left' },
        { transform: 'scaleX(0.3)', transformOrigin: 'left' },
        { transform: 'scaleX(1)', transformOrigin: 'left' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Chevron movement animation (continuous)
    if (chevronEl) {
      chevronEl.animate([
        { transform: 'translateX(0px)', opacity: '1' },
        { transform: 'translateX(-2px)', opacity: '0.6' },
        { transform: 'translateX(0px)', opacity: '1' }
      ], {
        duration: 500,
        iterations: Infinity,
        iterationStart: 0,
        delay: 500
      });
    }
    
    // Reset animation state (but keep chevron going)
    setTimeout(() => {
      isAnimating = false;
    }, 600);
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop chevron animation
    if (chevronEl) {
      chevronEl.getAnimations().forEach(animation => animation.finish());
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
  class={clsx(className)} 
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
      bind:this={lineEl}
      d="M12 19h8"
    />
    
    <path
      bind:this={chevronEl}
      d="m4 17 6-6-6-6"
    />
  </svg>
</div>
