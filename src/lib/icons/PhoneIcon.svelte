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
  let groupEl: SVGGElement;
  let pathEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Group wave animation
    if (groupEl) {
      groupEl.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-3deg) scale(1.02)' },
        { transform: 'rotate(3deg) scale(1)' },
        { transform: 'rotate(-2deg) scale(1.015)' },
        { transform: 'rotate(2deg) scale(1)' },
        { transform: 'rotate(0deg) scale(1)' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
    }
    
    // Path draw and glow animation
    if (pathEl) {
      pathEl.animate([
        { strokeDashoffset: '110', opacity: '0.55' },
        { strokeDashoffset: '0', opacity: '1' },
        { strokeDashoffset: '0', opacity: '0.9' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 900,
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
    class="lucide lucide-phone-icon lucide-phone"
  >
    <g bind:this={groupEl}>
      <path
        bind:this={pathEl}
        d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
        stroke-dasharray="110"
        stroke-dashoffset="110"
      />
    </g>
  </svg>
</div>
