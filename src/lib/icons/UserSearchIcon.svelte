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
  let bodyEl: SVGPathElement;
  let headEl: SVGCircleElement;
  let searchGroupEl: SVGGElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Body drawing animation
    if (bodyEl) {
      bodyEl.animate([
        { strokeDashoffset: '40', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 700,
        easing: 'ease-in-out'
      });
    }
    
    // Head scale animation
    if (headEl) {
      headEl.animate([
        { transform: 'scale(0.5)', opacity: '0' },
        { transform: 'scale(1.2)', opacity: '1' },
        { transform: 'scale(1)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }
    
    // Search movement animation
    if (searchGroupEl) {
      searchGroupEl.animate([
        { transform: 'translate(0px, 0px) rotate(0deg)', opacity: '1' },
        { transform: 'translate(2px, -1px) rotate(5deg)', opacity: '1' },
        { transform: 'translate(-2px, 2px) rotate(-5deg)', opacity: '1' },
        { transform: 'translate(1px, -1px) rotate(3deg)', opacity: '1' },
        { transform: 'translate(0px, 0px) rotate(0deg)', opacity: '1' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1200);
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
  class={clsx("inline-flex items-center justify-center", className)} 
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
    class="lucide lucide-user-search-icon lucide-user-search"
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
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />
    <g bind:this={searchGroupEl}>
      <circle cx="17" cy="17" r="3" />
      <path d="m21 21-1.9-1.9" />
    </g>
  </svg>
</div>
