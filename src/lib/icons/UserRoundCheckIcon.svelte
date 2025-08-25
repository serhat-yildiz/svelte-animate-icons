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
          duration: 700,
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
      }, 600);
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
    class="lucide lucide-user-round-check-icon lucide-user-round-check"
  >
    <path
      bind:this={bodyEl}
      d="M2 21a8 8 0 0 1 13.292-6"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle
      bind:this={headEl}
      cx="10"
      cy="8"
      r="5"
    />
    <path
      bind:this={tickEl}
      d="m16 19 2 2 4-4"
      stroke-dasharray="20"
      stroke-dashoffset="20"
    />
  </svg>
</div>
