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
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let tickEl: SVGPathElement;
  
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
    
    // Body drawing animation (delayed)
    if (bodyEl) {
      setTimeout(() => {
        bodyEl.animate([
          { strokeDashoffset: '40', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 200);
    }
    
    // Tick drawing animation (delayed)
    if (tickEl) {
      setTimeout(() => {
        tickEl.animate([
          { strokeDashoffset: '20', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 500);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1100);
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
    class="lucide lucide-user-check-icon lucide-user-check"
  >
    <path
      bind:this={tickEl}
      d="m16 11 2 2 4-4"
      stroke-dasharray="20"
      stroke-dashoffset="20"
    />
    <path
      bind:this={bodyEl}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle
      bind:this={headEl}
      cx="9"
      cy="7"
      r="4"
    />
  </svg>
</div>
