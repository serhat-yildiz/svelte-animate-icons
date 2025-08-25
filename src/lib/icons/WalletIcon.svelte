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
  let flapGroupEl: SVGGElement;
  let swipeEl: SVGLineElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Body drawing animation
    if (bodyEl) {
      bodyEl.animate([
        { strokeDashoffset: '80', opacity: '0.4' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Flap rotation animation (delayed)
    if (flapGroupEl) {
      setTimeout(() => {
        flapGroupEl.animate([
          { transform: 'rotate(0deg)', transformOrigin: '10% 50%' },
          { transform: 'rotate(-6deg)', transformOrigin: '10% 50%' },
          { transform: 'rotate(0deg)', transformOrigin: '10% 50%' },
          { transform: 'rotate(-3deg)', transformOrigin: '10% 50%' },
          { transform: 'rotate(0deg)', transformOrigin: '10% 50%' }
        ], {
          duration: 900,
          easing: 'ease-in-out'
        });
      }, 200);
    }
    
    // Swipe animation (delayed)
    if (swipeEl) {
      setTimeout(() => {
        swipeEl.animate([
          { transform: 'translateX(0px)', opacity: '0' },
          { transform: 'translateX(6px)', opacity: '1' },
          { transform: 'translateX(0px)', opacity: '0' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 450);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1300);
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
    class="lucide lucide-wallet-icon lucide-wallet"
  >
    <path
      bind:this={bodyEl}
      d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
      stroke-dasharray="80"
      stroke-dashoffset="80"
    />
    <g bind:this={flapGroupEl}>
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    </g>
    <line
      bind:this={swipeEl}
      x1="14" y1="12" x2="18" y2="12"
    />
  </svg>
</div>
