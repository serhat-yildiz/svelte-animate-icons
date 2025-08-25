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
  let crossGroupEl: SVGGElement;
  let crossLine1El: SVGPathElement;
  let crossLine2El: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Body drawing animation
    if (bodyEl) {
      bodyEl.animate([
        { strokeDashoffset: '60', opacity: '0.3' },
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
    
    // Cross group scale and rotation animation
    if (crossGroupEl) {
      crossGroupEl.animate([
        { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        { transform: 'scale(1.3) rotate(-10deg)', opacity: '1' },
        { transform: 'scale(1) rotate(10deg)', opacity: '1' },
        { transform: 'scale(1) rotate(0deg)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Cross lines drawing animation
    const crossLines = [crossLine1El, crossLine2El];
    crossLines.forEach((line) => {
      if (line) {
        line.animate([
          { strokeDashoffset: '20' },
          { strokeDashoffset: '0' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }
    });
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 700);
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
    class="lucide lucide-user-round-x-icon lucide-user-round-x"
  >
    <path
      bind:this={bodyEl}
      d="M2 21a8 8 0 0 1 11.873-7"
      stroke-dasharray="60"
      stroke-dashoffset="60"
    />
    <circle
      bind:this={headEl}
      cx="10"
      cy="8"
      r="5"
    />
    <g bind:this={crossGroupEl}>
      <path
        bind:this={crossLine1El}
        d="m17 17 5 5"
        stroke-dasharray="20"
        stroke-dashoffset="20"
      />
      <path
        bind:this={crossLine2El}
        d="m22 17-5 5"
        stroke-dasharray="20"
        stroke-dashoffset="20"
      />
    </g>
  </svg>
</div>
