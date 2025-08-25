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
  let flapEl: SVGPathElement;
  let outlinePath1El: SVGPathElement;
  let outlineRectEl: SVGRectElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG bounce animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'translateY(0px) scale(1)' },
        { transform: 'translateY(-3px) scale(1.05)' },
        { transform: 'translateY(3px) scale(0.95)' },
        { transform: 'translateY(-2px) scale(1)' },
        { transform: 'translateY(0px) scale(1)' }
      ], {
        duration: 1600,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        iterations: Infinity
      });
    }
    
    // Flap animation (continuous)
    if (flapEl) {
      flapEl.animate([
        { transform: 'rotate(-4deg)', opacity: '1' },
        { transform: 'rotate(4deg)', opacity: '0.7' },
        { transform: 'rotate(-3deg)', opacity: '1' },
        { transform: 'rotate(0deg)', opacity: '1' }
      ], {
        duration: 1200,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        iterations: Infinity
      });
    }
    
    // Outline animations (continuous)
    if (outlinePath1El) {
      outlinePath1El.animate([
        { opacity: '0.7' },
        { opacity: '1' },
        { opacity: '0.5' },
        { opacity: '1' }
      ], {
        duration: 1400,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        iterations: Infinity
      });
    }
    
    if (outlineRectEl) {
      outlineRectEl.animate([
        { opacity: '0.7' },
        { opacity: '1' },
        { opacity: '0.5' },
        { opacity: '1' }
      ], {
        duration: 1400,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, flapEl, outlinePath1El, outlineRectEl].forEach(el => {
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
      bind:this={outlinePath1El}
      d="M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732"
    />
    <path
      bind:this={flapEl}
      d="m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5"
    />
    <rect
      bind:this={outlineRectEl}
      x="7"
      y="3"
      width="15"
      height="12"
      rx="2"
    />
  </svg>
</div>
