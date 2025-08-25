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
  let curveEl: SVGPathElement;
  let midEl: SVGPathElement;
  let vertEl: SVGPathElement;
  let baseEl: SVGPathElement;
  
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
    
    // Curve stroke animation (delayed)
    if (curveEl) {
      setTimeout(() => {
        curveEl.animate([
          { strokeDashoffset: curveEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Mid stroke animation (delayed)
    if (midEl) {
      setTimeout(() => {
        midEl.animate([
          { strokeDashoffset: midEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 160);
    }
    
    // Vertical stroke animation (delayed)
    if (vertEl) {
      setTimeout(() => {
        vertEl.animate([
          { strokeDashoffset: vertEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 260);
    }
    
    // Base stroke animation (delayed)
    if (baseEl) {
      setTimeout(() => {
        baseEl.animate([
          { strokeDashoffset: baseEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 360);
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
    class="lucide lucide-pound-sterling-icon lucide-pound-sterling"
  >
    <g opacity="0.35">
      <path d="M18 7c0-5.333-8-5.333-8 0" />
      <path d="M10 7v14" />
      <path d="M6 21h12" />
      <path d="M6 13h10" />
    </g>

    <path
      bind:this={curveEl}
      d="M18 7c0-5.333-8-5.333-8 0"
      stroke-dasharray={curveEl?.getTotalLength() || 20}
      stroke-dashoffset={curveEl?.getTotalLength() || 20}
    />
    <path
      bind:this={midEl}
      d="M6 13h10"
      stroke-dasharray={midEl?.getTotalLength() || 10}
      stroke-dashoffset={midEl?.getTotalLength() || 10}
    />
    <path
      bind:this={vertEl}
      d="M10 7v14"
      stroke-dasharray={vertEl?.getTotalLength() || 14}
      stroke-dashoffset={vertEl?.getTotalLength() || 14}
    />
    <path
      bind:this={baseEl}
      d="M6 21h12"
      stroke-dasharray={baseEl?.getTotalLength() || 12}
      stroke-dashoffset={baseEl?.getTotalLength() || 12}
    />
  </svg>
</div>
