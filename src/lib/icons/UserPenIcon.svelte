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
  let penEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Head scale animation
    if (headEl) {
      headEl.animate([
        { transform: 'scale(0.5)', opacity: '0' },
        { transform: 'scale(1.15)', opacity: '1' },
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
    
    // Pen writing animation (delayed)
    if (penEl) {
      setTimeout(() => {
        penEl.animate([
          { transform: 'rotate(-10deg) translateX(0px) translateY(0px)' },
          { transform: 'rotate(-5deg) translateX(2px) translateY(2px)' },
          { transform: 'rotate(-12deg) translateX(-2px) translateY(-1px)' },
          { transform: 'rotate(-6deg) translateX(1px) translateY(1px)' },
          { transform: 'rotate(-10deg) translateX(0px) translateY(0px)' }
        ], {
          duration: 1200,
          iterations: 2,
          easing: 'ease-in-out'
        });
      }, 600);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 3000);
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
    class="lucide lucide-user-pen-icon lucide-user-pen"
  >
    <path
      bind:this={bodyEl}
      d="M11.5 15H7a4 4 0 0 0-4 4v2"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <circle
      bind:this={headEl}
      cx="10"
      cy="7"
      r="4"
    />
    <path
      bind:this={penEl}
      d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    />
  </svg>
</div>
