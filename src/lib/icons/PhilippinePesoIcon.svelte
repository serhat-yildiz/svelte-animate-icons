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
  let topStrokeEl: SVGPathElement;
  let midStrokeEl: SVGPathElement;
  let pStrokeEl: SVGPathElement;
  
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
    
    // Top stroke animation (delayed)
    if (topStrokeEl) {
      setTimeout(() => {
        topStrokeEl.animate([
          { strokeDashoffset: topStrokeEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Mid stroke animation (delayed)
    if (midStrokeEl) {
      setTimeout(() => {
        midStrokeEl.animate([
          { strokeDashoffset: midStrokeEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 160);
    }
    
    // P stroke animation (delayed)
    if (pStrokeEl) {
      setTimeout(() => {
        pStrokeEl.animate([
          { strokeDashoffset: pStrokeEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 900,
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
    class="lucide lucide-philippine-peso-icon lucide-philippine-peso"
  >
    <g opacity="0.35">
      <path d="M20 11H4" />
      <path d="M20 7H4" />
      <path d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" />
    </g>

    <path
      bind:this={topStrokeEl}
      d="M20 7H4"
      stroke-dasharray={topStrokeEl?.getTotalLength() || 16}
      stroke-dashoffset={topStrokeEl?.getTotalLength() || 16}
    />
    <path
      bind:this={midStrokeEl}
      d="M20 11H4"
      stroke-dasharray={midStrokeEl?.getTotalLength() || 16}
      stroke-dashoffset={midStrokeEl?.getTotalLength() || 16}
    />
    <path
      bind:this={pStrokeEl}
      d="M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7"
      stroke-dasharray={pStrokeEl?.getTotalLength() || 50}
      stroke-dashoffset={pStrokeEl?.getTotalLength() || 50}
    />
  </svg>
</div>
