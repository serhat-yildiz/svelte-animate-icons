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
  let horizontalLineEl: SVGPathElement;
  let verticalLineEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG plus animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.2) rotate(10deg)' },
        { transform: 'scale(0.85) rotate(-10deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 1000,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Line drawing animations (continuous with delay)
    if (horizontalLineEl) {
      horizontalLineEl.animate([
        { strokeDashoffset: horizontalLineEl.getTotalLength(), opacity: '1' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out',
        iterations: Infinity,
        iterationStart: 0,
        delay: 0
      });
    }
    
    if (verticalLineEl) {
      verticalLineEl.animate([
        { strokeDashoffset: verticalLineEl.getTotalLength(), opacity: '1' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out',
        iterations: Infinity,
        iterationStart: 0,
        delay: 400
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, horizontalLineEl, verticalLineEl].forEach(el => {
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
      bind:this={horizontalLineEl}
      d="M5 12h14" 
      stroke-dasharray={horizontalLineEl?.getTotalLength() || 14}
      stroke-dashoffset={horizontalLineEl?.getTotalLength() || 14}
    />
    <path 
      bind:this={verticalLineEl}
      d="M12 5v14" 
      stroke-dasharray={verticalLineEl?.getTotalLength() || 14}
      stroke-dashoffset={verticalLineEl?.getTotalLength() || 14}
    />
  </svg>
</div>
