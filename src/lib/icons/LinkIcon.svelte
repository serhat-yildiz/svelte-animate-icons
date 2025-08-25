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
  let leftPathEl: SVGPathElement;
  let rightPathEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Left link animation
    if (leftPathEl) {
      leftPathEl.animate([
        { transform: 'translate(0px, 0px) rotate(0deg)' },
        { transform: 'translate(-2px, 0px) rotate(-3deg)' },
        { transform: 'translate(0px, 0px) rotate(0deg)' }
      ], {
        duration: 900,
        easing: 'ease-in-out'
      });
    }
    
    // Right link animation
    if (rightPathEl) {
      rightPathEl.animate([
        { transform: 'translate(0px, 0px) rotate(0deg)' },
        { transform: 'translate(2px, 0px) rotate(3deg)' },
        { transform: 'translate(0px, 0px) rotate(0deg)' }
      ], {
        duration: 900,
        easing: 'ease-in-out'
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 900);
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
    <path
      bind:this={rightPathEl}
      d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
    />
    <path
      bind:this={leftPathEl}
      d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
    />
  </svg>
</div>
