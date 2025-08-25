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
  let topStrokeEl: SVGPathElement;
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
          { strokeDashoffset: mainStrokeEl.getTotalLength(), opacity: '0.75' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 900,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Top stroke animation (delayed)
    if (topStrokeEl) {
      setTimeout(() => {
        topStrokeEl.animate([
          { strokeDashoffset: topStrokeEl.getTotalLength(), opacity: '0.75' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 180);
    }
    
    // Mid stroke animation (delayed)
    if (midStrokeEl) {
      setTimeout(() => {
        midStrokeEl.animate([
          { strokeDashoffset: midStrokeEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 280);
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
    class="lucide lucide-swiss-franc-icon lucide-swiss-franc"
  >
    <g opacity="0.35">
      <path d="M10 21V3h8" />
      <path d="M6 16h9" />
      <path d="M10 9.5h7" />
    </g>

    <path
      bind:this={mainStrokeEl}
      d="M10 21V3h8"
      stroke-dasharray={mainStrokeEl?.getTotalLength() || 30}
      stroke-dashoffset={mainStrokeEl?.getTotalLength() || 30}
    />
    <path
      bind:this={topStrokeEl}
      d="M10 9.5h7"
      stroke-dasharray={topStrokeEl?.getTotalLength() || 7}
      stroke-dashoffset={topStrokeEl?.getTotalLength() || 7}
    />
    <path
      bind:this={midStrokeEl}
      d="M6 16h9"
      stroke-dasharray={midStrokeEl?.getTotalLength() || 9}
      stroke-dashoffset={midStrokeEl?.getTotalLength() || 9}
    />
  </svg>
</div>
