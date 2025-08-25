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
  let boxEl: SVGPathElement;
  let arrowLineEl: SVGPathElement;
  let arrowHeadEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Box drawing animation
    if (boxEl) {
      boxEl.animate([
        { strokeDashoffset: boxEl.getTotalLength(), opacity: '0.6' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Arrow line movement animation
    if (arrowLineEl) {
      arrowLineEl.animate([
        { transform: 'translate(0px, 0px)', opacity: '1' },
        { transform: 'translate(3px, -3px)', opacity: '1' },
        { transform: 'translate(0px, 0px)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Arrow head movement animation
    if (arrowHeadEl) {
      arrowHeadEl.animate([
        { transform: 'translate(0px, 0px)', opacity: '1' },
        { transform: 'translate(3px, -3px)', opacity: '1' },
        { transform: 'translate(0px, 0px)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 800);
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
      bind:this={boxEl}
      d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"
      stroke-dasharray={boxEl?.getTotalLength() || 40}
      stroke-dashoffset={boxEl?.getTotalLength() || 40}
    />
    
    <path
      bind:this={arrowLineEl}
      d="m21 3-9 9"
    />
    
    <path
      bind:this={arrowHeadEl}
      d="M15 3h6v6"
    />
  </svg>
</div>
