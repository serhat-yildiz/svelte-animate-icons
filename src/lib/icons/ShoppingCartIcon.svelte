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
  let wheel1El: SVGCircleElement;
  let wheel2El: SVGCircleElement;
  let cartEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Cart bounce animation (continuous)
    if (cartEl) {
      cartEl.animate([
        { transform: 'translateY(0px) rotate(0deg)' },
        { transform: 'translateY(-3px) rotate(-4deg)' },
        { transform: 'translateY(0px) rotate(3deg)' },
        { transform: 'translateY(-1px) rotate(-2deg)' },
        { transform: 'translateY(0px) rotate(0deg)' }
      ], {
        duration: 1800,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Wheel rotation animations (continuous)
    if (wheel1El) {
      wheel1El.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
      ], {
        duration: 1000,
        easing: 'linear',
        iterations: Infinity
      });
    }
    
    if (wheel2El) {
      wheel2El.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
      ], {
        duration: 1000,
        easing: 'linear',
        iterations: Infinity
      });
    }
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [wheel1El, wheel2El, cartEl].forEach(el => {
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
    <circle bind:this={wheel1El} cx="8" cy="21" r="1" />
    <circle bind:this={wheel2El} cx="19" cy="21" r="1" />
    
    <path
      bind:this={cartEl}
      d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
    />
  </svg>
</div>
