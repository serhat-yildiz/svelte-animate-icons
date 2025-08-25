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
  let mainStrokeEl: SVGPathElement;
  let midStrokeEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG animation
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg) translateY(0px)' },
        { transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
        { transform: 'scale(1) rotate(2deg) translateY(0px)' },
        { transform: 'scale(1) rotate(0deg) translateY(0px)' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }
    
    // Main stroke animation (delayed)
    if (mainStrokeEl) {
      setTimeout(() => {
        mainStrokeEl.animate([
          { strokeDashoffset: mainStrokeEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 900,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Mid stroke animation (delayed)
    if (midStrokeEl) {
      setTimeout(() => {
        midStrokeEl.animate([
          { strokeDashoffset: midStrokeEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 260);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1500);
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
    class="lucide lucide-russian-ruble-icon lucide-russian-ruble"
  >
    <g opacity="0.35">
      <path d="M6 11h8a4 4 0 0 0 0-8H9v18" />
      <path d="M6 15h8" />
    </g>

    <path
      bind:this={mainStrokeEl}
      d="M6 11h8a4 4 0 0 0 0-8H9v18"
      stroke-dasharray={mainStrokeEl?.getTotalLength() || 40}
      stroke-dashoffset={mainStrokeEl?.getTotalLength() || 40}
    />
    <path
      bind:this={midStrokeEl}
      d="M6 15h8"
      stroke-dasharray={midStrokeEl?.getTotalLength() || 8}
      stroke-dashoffset={midStrokeEl?.getTotalLength() || 8}
    />
  </svg>
</div>
