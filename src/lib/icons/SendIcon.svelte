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
  let paperPlaneEl: SVGPathElement;
  let trailEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'rotate(0deg) translateX(0px) scale(1)' },
        { transform: 'rotate(-5deg) translateX(2px) scale(1.05)' },
        { transform: 'rotate(5deg) translateX(-2px) scale(0.95)' },
        { transform: 'rotate(0deg) translateX(0px) scale(1)' }
      ], {
        duration: 1600,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Paper plane path animation (continuous)
    if (paperPlaneEl) {
      paperPlaneEl.animate([
        { strokeDashoffset: paperPlaneEl.getTotalLength(), opacity: '0.5' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1400,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Trail path animation (continuous)
    if (trailEl) {
      trailEl.animate([
        { strokeDashoffset: trailEl.getTotalLength(), opacity: '0.5' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1400,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, paperPlaneEl, trailEl].forEach(el => {
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
      bind:this={paperPlaneEl}
      d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
      stroke-dasharray={paperPlaneEl?.getTotalLength() || 80}
      stroke-dashoffset={paperPlaneEl?.getTotalLength() || 80}
    />
    <path 
      bind:this={trailEl}
      d="m21.854 2.147-10.94 10.939" 
      stroke-dasharray={trailEl?.getTotalLength() || 15}
      stroke-dashoffset={trailEl?.getTotalLength() || 15}
    />
  </svg>
</div>
