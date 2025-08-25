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
  let shieldEl: SVGPathElement;
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Shield drawing animation
    if (shieldEl) {
      shieldEl.animate([
        { strokeDashoffset: '120', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Head animation (delayed)
    if (headEl) {
      setTimeout(() => {
        headEl.animate([
          { transform: 'scale(0.5)', opacity: '0' },
          { transform: 'scale(1.2)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-out'
        });
      }, 300);
    }
    
    // Body animation (delayed)
    if (bodyEl) {
      setTimeout(() => {
        bodyEl.animate([
          { transform: 'translateY(6px)', opacity: '0' },
          { transform: 'translateY(0px)', opacity: '1' }
        ], {
          duration: 500,
          easing: 'ease-out'
        });
      }, 500);
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
    class="lucide lucide-shield-user-icon lucide-shield-user"
  >
    <path
      bind:this={shieldEl}
      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      stroke-dasharray="120"
      stroke-dashoffset="0"
    />
    <path
      bind:this={bodyEl}
      d="M6.376 18.91a6 6 0 0 1 11.249.003"
    />
    <circle
      bind:this={headEl}
      cx="12"
      cy="11"
      r="4"
    />
  </svg>
</div>
