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
  let arcEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let sideEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Arc drawing animation
    if (arcEl) {
      arcEl.animate([
        { strokeDashoffset: '60', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
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
    
    // Side drawing animation (delayed)
    if (sideEl) {
      setTimeout(() => {
        sideEl.animate([
          { strokeDashoffset: '50', opacity: '0.2' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 400);
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
    class="lucide lucide-users-round-icon lucide-users-round"
  >
    <path
      bind:this={arcEl}
      d="M18 21a8 8 0 0 0-16 0"
      stroke-dasharray="60"
      stroke-dashoffset="60"
    />
    <circle
      bind:this={headEl}
      cx="10"
      cy="8"
      r="5"
    />
    <path
      bind:this={sideEl}
      d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"
      stroke-dasharray="50"
      stroke-dashoffset="50"
    />
  </svg>
</div>
