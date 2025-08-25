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
  let sideArc1El: SVGPathElement;
  let sideArc2El: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Arc drawing animation
    if (arcEl) {
      arcEl.animate([
        { strokeDashoffset: '50', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 700,
        easing: 'ease-in-out'
      });
    }
    
    // Head scale animation
    if (headEl) {
      headEl.animate([
        { transform: 'scale(0.6)', opacity: '0' },
        { transform: 'scale(1.2)', opacity: '1' },
        { transform: 'scale(1)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }
    
    // Side arcs drawing animation (delayed)
    const sideArcs = [sideArc1El, sideArc2El];
    sideArcs.forEach((arc) => {
      if (arc) {
        setTimeout(() => {
          arc.animate([
            { strokeDashoffset: '40', opacity: '0.2' },
            { strokeDashoffset: '0', opacity: '1' }
          ], {
            duration: 700,
            easing: 'ease-in-out'
          });
        }, 300);
      }
    });
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1000);
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
    class="lucide lucide-users-icon lucide-users"
  >
    <path
      bind:this={arcEl}
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke-dasharray="50"
      stroke-dashoffset="50"
    />
    <path
      bind:this={sideArc1El}
      d="M16 3.128a4 4 0 0 1 0 7.744"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <path
      bind:this={sideArc2El}
      d="M22 21v-2a4 4 0 0 0-3-3.87"
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
