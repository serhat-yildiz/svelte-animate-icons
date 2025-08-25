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
  let headEl: SVGCircleElement;
  let bodyEl: SVGPathElement;
  let lockPathEl: SVGPathElement;
  let lockRectEl: SVGRectElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Head and body scale animation
    const headBodyElements = [headEl, bodyEl];
    headBodyElements.forEach((el) => {
      if (el) {
        el.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.05)' },
          { transform: 'scale(1)' }
        ], {
          duration: 400,
          easing: 'ease-in-out'
        });
      }
    });
    
    // Lock shake animation
    const lockElements = [lockPathEl, lockRectEl];
    lockElements.forEach((el) => {
      if (el) {
        el.animate([
          { transform: 'translateX(0px) rotate(0deg)' },
          { transform: 'translateX(-2px) rotate(-3deg)' },
          { transform: 'translateX(2px) rotate(3deg)' },
          { transform: 'translateX(-2px) rotate(-3deg)' },
          { transform: 'translateX(2px) rotate(3deg)' },
          { transform: 'translateX(0px) rotate(0deg)' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }
    });
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 500);
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
    <circle
      bind:this={headEl}
      cx="10"
      cy="7"
      r="4"
    />
    <path
      bind:this={bodyEl}
      d="M10.3 15H7a4 4 0 0 0-4 4v2"
    />
    <path
      bind:this={lockPathEl}
      d="M15 15.5V14a2 2 0 0 1 4 0v1.5"
    />
    <rect
      bind:this={lockRectEl}
      width="8"
      height="5"
      x="13"
      y="16"
      rx=".899"
    />
  </svg>
</div>
