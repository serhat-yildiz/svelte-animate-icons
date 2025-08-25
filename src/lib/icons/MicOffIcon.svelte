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
  let slashEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Microphone animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg) translateY(0px)' },
        { transform: 'scale(1.05) rotate(-3deg) translateY(-1px)' },
        { transform: 'scale(0.95) rotate(3deg) translateY(0px)' },
        { transform: 'scale(1) rotate(-2deg) translateY(0px)' },
        { transform: 'scale(1) rotate(2deg) translateY(0px)' },
        { transform: 'scale(1) rotate(0deg) translateY(0px)' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Slash animation
    if (slashEl) {
      slashEl.animate([
        { strokeDashoffset: '0', opacity: '1' },
        { strokeDashoffset: slashEl.getTotalLength(), opacity: '1' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, slashEl].forEach(el => {
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
    <path d="M12 19v3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <rect x="9" y="2" width="6" height="13" rx="3" />
    <path 
      bind:this={slashEl}
      d="M2 2L22 22" 
      stroke-dasharray={slashEl?.getTotalLength() || 28}
      stroke-dashoffset="0"
    />
  </svg>
</div>
