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
  let svgEl: SVGSVGElement;
  let paths: SVGPathElement[] = [];
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG rotation and scale animation
    if (svgEl) {
      svgEl.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(10deg) scale(1.05)' },
        { transform: 'rotate(-10deg) scale(1.05)' },
        { transform: 'rotate(0deg) scale(1)' }
      ], {
        duration: 1000,
        easing: 'ease-in-out'
      });
    }
    
    // Path animations
    paths.forEach((path) => {
      if (path) {
        path.animate([
          { strokeDashoffset: '0', opacity: '1' },
          { strokeDashoffset: path.getTotalLength() * 0.7, opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
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
  class={clsx(className)} 
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  {...restProps}
>
  <svg
    bind:this={svgEl}
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
    <path bind:this={paths[0]} d="m10 20-1.25-2.5L6 18" stroke-dasharray={paths[0]?.getTotalLength() || 10} />
    <path bind:this={paths[1]} d="M10 4 8.75 6.5 6 6" stroke-dasharray={paths[1]?.getTotalLength() || 10} />
    <path bind:this={paths[2]} d="m14 20 1.25-2.5L18 18" stroke-dasharray={paths[2]?.getTotalLength() || 10} />
    <path bind:this={paths[3]} d="m14 4 1.25 2.5L18 6" stroke-dasharray={paths[3]?.getTotalLength() || 10} />
    <path bind:this={paths[4]} d="m17 21-3-6h-4" stroke-dasharray={paths[4]?.getTotalLength() || 15} />
    <path bind:this={paths[5]} d="m17 3-3 6 1.5 3" stroke-dasharray={paths[5]?.getTotalLength() || 15} />
    <path bind:this={paths[6]} d="M2 12h6.5L10 9" stroke-dasharray={paths[6]?.getTotalLength() || 12} />
    <path bind:this={paths[7]} d="m20 10-1.5 2 1.5 2" stroke-dasharray={paths[7]?.getTotalLength() || 8} />
    <path bind:this={paths[8]} d="M22 12h-6.5L14 15" stroke-dasharray={paths[8]?.getTotalLength() || 12} />
    <path bind:this={paths[9]} d="m4 10 1.5 2L4 14" stroke-dasharray={paths[9]?.getTotalLength() || 8} />
    <path bind:this={paths[10]} d="m7 21 3-6-1.5-3" stroke-dasharray={paths[10]?.getTotalLength() || 15} />
    <path bind:this={paths[11]} d="m7 3 3 6h4" stroke-dasharray={paths[11]?.getTotalLength() || 15} />
  </svg>
</div>
