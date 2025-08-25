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
  let line1El: SVGPathElement;
  let line2El: SVGPathElement;
  let line3El: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Line animations with stagger and different directions
    const lines = [line1El, line2El, line3El];
    lines.forEach((line, index) => {
      if (line) {
        setTimeout(() => {
          const direction = index % 2 === 0 ? 4 : -4;
          line.animate([
            { transform: 'translateX(0px)', opacity: '1' },
            { transform: `translateX(${direction}px)`, opacity: '0.5' },
            { transform: 'translateX(0px)', opacity: '1' }
          ], {
            duration: 400,
            easing: 'ease-out'
          });
        }, index * 100);
      }
    });
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 700);
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
    <path bind:this={line1El} d="M4 12h16" />
    <path bind:this={line2El} d="M4 18h16" />
    <path bind:this={line3El} d="M4 6h16" />
  </svg>
</div>
