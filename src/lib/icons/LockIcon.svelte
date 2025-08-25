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
    
    // Lock shake animation
    if (svgEl) {
      svgEl.animate([
        { transform: 'translate(0px) rotate(0deg)' },
        { transform: 'translate(-3px) rotate(-2deg)' },
        { transform: 'translate(3px) rotate(2deg)' },
        { transform: 'translate(-3px) rotate(-2deg)' },
        { transform: 'translate(3px) rotate(2deg)' },
        { transform: 'translate(0px) rotate(0deg)' }
      ], {
        duration: 400,
        easing: 'ease-out'
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 400);
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
  class={clsx(className)} 
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
</div>
