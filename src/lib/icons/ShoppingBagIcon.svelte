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
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Bag animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'scaleY(1) scaleX(1) rotate(0deg) translateY(0px)' },
        { transform: 'scaleY(0.85) scaleX(1.1) rotate(-4deg) translateY(-3px)' },
        { transform: 'scaleY(1.1) scaleX(0.9) rotate(4deg) translateY(0px)' },
        { transform: 'scaleY(1) scaleX(1) rotate(-2deg) translateY(-1px)' },
        { transform: 'scaleY(1) scaleX(1) rotate(0deg) translateY(0px)' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    if (svgEl) {
      svgEl.getAnimations().forEach(animation => animation.finish());
    }
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
    <path d="M16 10a4 4 0 0 1-8 0" />
    <path d="M3.103 6.034h17.794" />
    <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
  </svg>
</div>
