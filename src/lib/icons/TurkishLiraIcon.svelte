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
  let topSlashEl: SVGPathElement;
  let midSlashEl: SVGPathElement;
  let mainStrokeEl: SVGPathElement;
  
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
    
    // Top slash animation (delayed)
    if (topSlashEl) {
      setTimeout(() => {
        topSlashEl.animate([
          { strokeDashoffset: topSlashEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Mid slash animation (delayed)
    if (midSlashEl) {
      setTimeout(() => {
        midSlashEl.animate([
          { strokeDashoffset: midSlashEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 550,
          easing: 'ease-in-out'
        });
      }, 160);
    }
    
    // Main stroke animation (delayed)
    if (mainStrokeEl) {
      setTimeout(() => {
        mainStrokeEl.animate([
          { strokeDashoffset: mainStrokeEl.getTotalLength(), opacity: '0.8' },
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
    class="lucide lucide-turkish-lira-icon lucide-turkish-lira"
  >
    <g opacity="0.35">
      <path d="M15 4 5 9" />
      <path d="m15 8.5-10 5" />
      <path d="M18 12a9 9 0 0 1-9 9V3" />
    </g>

    <path
      bind:this={topSlashEl}
      d="M15 4 5 9"
      stroke-dasharray={topSlashEl?.getTotalLength() || 12}
      stroke-dashoffset={topSlashEl?.getTotalLength() || 12}
    />
    <path
      bind:this={midSlashEl}
      d="m15 8.5-10 5"
      stroke-dasharray={midSlashEl?.getTotalLength() || 12}
      stroke-dashoffset={midSlashEl?.getTotalLength() || 12}
    />
    <path
      bind:this={mainStrokeEl}
      d="M18 12a9 9 0 0 1-9 9V3"
      stroke-dasharray={mainStrokeEl?.getTotalLength() || 30}
      stroke-dashoffset={mainStrokeEl?.getTotalLength() || 30}
    />
  </svg>
</div>
