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
    
    // SVG scale and rotation animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.1) rotate(-3deg)' },
        { transform: 'scale(0.95) rotate(3deg)' },
        { transform: 'scale(1) rotate(-2deg)' },
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
        { strokeDashoffset: pathEl.getTotalLength(), opacity: '0.8' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1300,
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
    stroke="currentColor"
    fill="currentColor"
    viewBox="0 0 512 512"
    height={size}
    width={size}
  >
    <path
      bind:this={pathEl}
      d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 
         106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 
         389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
      stroke-dasharray={pathEl?.getTotalLength() || 100}
      stroke-dashoffset={pathEl?.getTotalLength() || 100}
    />
  </svg>
</div>
