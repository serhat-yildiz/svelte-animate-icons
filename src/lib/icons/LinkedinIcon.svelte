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
  let rectEl: SVGRectElement;
  let circleEl: SVGCircleElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG icon variants animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.08) rotate(-3deg)' },
        { transform: 'scale(0.95) rotate(3deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 1300,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Path drawing animation (continuous)
    if (pathEl) {
      pathEl.animate([
        { strokeDashoffset: pathEl.getTotalLength(), opacity: '0.7' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Rectangle drawing animation (continuous)
    if (rectEl) {
      rectEl.animate([
        { strokeDashoffset: rectEl.getTotalLength(), opacity: '0.7' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Circle drawing animation (continuous)
    if (circleEl) {
      circleEl.animate([
        { strokeDashoffset: circleEl.getTotalLength(), opacity: '0.7' },
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
    // Stop all animations by getting all animations and finishing them
    if (svgEl) {
      svgEl.getAnimations().forEach(animation => animation.finish());
    }
    if (pathEl) {
      pathEl.getAnimations().forEach(animation => animation.finish());
    }
    if (rectEl) {
      rectEl.getAnimations().forEach(animation => animation.finish());
    }
    if (circleEl) {
      circleEl.getAnimations().forEach(animation => animation.finish());
    }
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
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke-dasharray={pathEl?.getTotalLength() || 100}
      stroke-dashoffset={pathEl?.getTotalLength() || 100}
    />
    <rect
      bind:this={rectEl}
      width="4"
      height="12"
      x="2"
      y="9"
      stroke-dasharray={rectEl?.getTotalLength() || 32}
      stroke-dashoffset={rectEl?.getTotalLength() || 32}
    />
    <circle 
      bind:this={circleEl}
      cx="4" 
      cy="4" 
      r="2" 
      stroke-dasharray={circleEl?.getTotalLength() || 13}
      stroke-dashoffset={circleEl?.getTotalLength() || 13}
    />
  </svg>
</div>
