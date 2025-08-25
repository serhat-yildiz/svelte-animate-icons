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
  let curveEl: SVGPathElement;
  let headEl: SVGCircleElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Head scale animation
    if (headEl) {
      headEl.animate([
        { transform: 'scale(0.5)', opacity: '0' },
        { transform: 'scale(1.2)', opacity: '1' },
        { transform: 'scale(1)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }
    
    // Curve drawing animation (delayed)
    if (curveEl) {
      setTimeout(() => {
        curveEl.animate([
          { strokeDashoffset: '40', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 300);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 900);
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
    class="lucide lucide-user-round-icon lucide-user-round"
  >
    <circle
      bind:this={headEl}
      cx="12"
      cy="8"
      r="5"
    />
    <path
      bind:this={curveEl}
      d="M20 21a8 8 0 0 0-16 0"
      stroke-dasharray="40"
      stroke-dashoffset="0"
    />
  </svg>
</div>
