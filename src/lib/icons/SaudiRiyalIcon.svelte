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
  let leftMainEl: SVGPathElement;
  let crossStrokeEl: SVGPathElement;
  let rightMainEl: SVGPathElement;
  let tailStrokeEl: SVGPathElement;
  
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
    
    // Left main stroke animation (delayed)
    if (leftMainEl) {
      setTimeout(() => {
        leftMainEl.animate([
          { strokeDashoffset: leftMainEl.getTotalLength(), opacity: '0.7' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 60);
    }
    
    // Cross stroke animation (delayed)
    if (crossStrokeEl) {
      setTimeout(() => {
        crossStrokeEl.animate([
          { strokeDashoffset: crossStrokeEl.getTotalLength(), opacity: '0.75' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 180);
    }
    
    // Right main stroke animation (delayed)
    if (rightMainEl) {
      setTimeout(() => {
        rightMainEl.animate([
          { strokeDashoffset: rightMainEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 300);
    }
    
    // Tail stroke animation (delayed)
    if (tailStrokeEl) {
      setTimeout(() => {
        tailStrokeEl.animate([
          { strokeDashoffset: tailStrokeEl.getTotalLength(), opacity: '0.8' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 440);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1600);
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
    class="lucide lucide-saudi-riyal-icon lucide-saudi-riyal"
  >
    <g opacity="0.35">
      <path d="m20 19.5-5.5 1.2" />
      <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" />
      <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" />
      <path d="M20 10 4 13.5" />
    </g>

    <path
      bind:this={leftMainEl}
      d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2"
      stroke-dasharray={leftMainEl?.getTotalLength() || 35}
      stroke-dashoffset={leftMainEl?.getTotalLength() || 35}
    />
    <path
      bind:this={crossStrokeEl}
      d="M20 10 4 13.5"
      stroke-dasharray={crossStrokeEl?.getTotalLength() || 18}
      stroke-dashoffset={crossStrokeEl?.getTotalLength() || 18}
    />
    <path
      bind:this={rightMainEl}
      d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2"
      stroke-dasharray={rightMainEl?.getTotalLength() || 25}
      stroke-dashoffset={rightMainEl?.getTotalLength() || 25}
    />
    <path
      bind:this={tailStrokeEl}
      d="m20 19.5-5.5 1.2"
      stroke-dasharray={tailStrokeEl?.getTotalLength() || 6}
      stroke-dashoffset={tailStrokeEl?.getTotalLength() || 6}
    />
  </svg>
</div>
