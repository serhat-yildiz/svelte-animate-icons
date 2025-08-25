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
  let pathEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG scale and rotate animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.05) rotate(-2deg)' },
        { transform: 'scale(0.95) rotate(2deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 1400,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Path drawing animation (continuous)
    if (pathEl) {
      pathEl.animate([
        { strokeDashoffset: pathEl.getTotalLength(), opacity: '0.6' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, pathEl].forEach(el => {
      if (el) {
        el.getAnimations().forEach(animation => animation.finish());
      }
    });
  }
  
  function handleMouseEnter() {
    startAnimation();
  }
  
  function handleMouseLeave() {
    stopAnimation();
  }
</script>

<div 
  class={clsx("inline-flex", className)} 
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
    <path
      bind:this={pathEl}
      d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
      stroke-dasharray={pathEl?.getTotalLength() || 100}
      stroke-dashoffset={pathEl?.getTotalLength() || 100}
    />
  </svg>
</div>
