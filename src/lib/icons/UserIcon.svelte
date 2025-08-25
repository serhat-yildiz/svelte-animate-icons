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
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Body drawing animation
    if (bodyEl) {
      bodyEl.animate([
        { strokeDashoffset: '40', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Head scale animation (delayed)
    if (headEl) {
      setTimeout(() => {
        headEl.animate([
          { transform: 'scale(0.6)', opacity: '0' },
          { transform: 'scale(1.2)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ], {
          duration: 500,
          easing: 'ease-out'
        });
      }, 200);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 800);
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
    class="lucide lucide-user-icon lucide-user"
  >
    <path
      bind:this={bodyEl}
      d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="0"
    />
    <circle
      bind:this={headEl}
      cx="12"
      cy="7"
      r="4"
    />
  </svg>
</div>
