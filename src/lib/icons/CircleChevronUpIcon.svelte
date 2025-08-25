<script lang="ts">
  import { clsx } from 'clsx';
  
  interface Props {
    size?: number;
    class?: string;
  }
  
  let { size = 32, class: className, ...restProps }: Props = $props();
  
  // Animation control
  let isAnimating = $state(false);
  
  // Refs for animation elements
  let circleEl: SVGCircleElement;
  let arrowEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Circle scale animation
    if (circleEl) {
      circleEl.animate([
        { transform: 'scale(1)', opacity: '1' },
        { transform: 'scale(1.1)', opacity: '1' },
        { transform: 'scale(0.9)', opacity: '1' },
        { transform: 'scale(1.05)', opacity: '1' },
        { transform: 'scale(1)', opacity: '1' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }
    
    // Arrow movement animation
    if (arrowEl) {
      arrowEl.animate([
        { transform: 'translateY(10px)', opacity: '0' },
        { transform: 'translateY(0px)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1200);
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
    <circle
      bind:this={circleEl}
      cx="12"
      cy="12"
      r="10"
    />
    <path
      bind:this={arrowEl}
      d="m8 14 4-4 4 4"
    />
  </svg>
</div>
