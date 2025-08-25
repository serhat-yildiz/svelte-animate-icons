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
  let shaftEl: SVGPathElement;
  let headEl: SVGPathElement;
  let trayEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Group pulse animation
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.02)' },
        { transform: 'scale(1)' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Shaft drawing animation
    if (shaftEl) {
      shaftEl.animate([
        { strokeDashoffset: '30', opacity: '0.4' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Head movement animation (delayed)
    if (headEl) {
      setTimeout(() => {
        headEl.animate([
          { transform: 'translateY(2px) scale(1)', opacity: '0.6' },
          { transform: 'translateY(-2px) scale(1.05)', opacity: '1' },
          { transform: 'translateY(0px) scale(1)', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 50);
    }
    
    // Tray drawing animation (delayed)
    if (trayEl) {
      setTimeout(() => {
        trayEl.animate([
          { strokeDashoffset: '60', opacity: '0.3' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 100);
    }
    
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
  class={clsx("inline-flex items-center justify-center", className)} 
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
    class="lucide lucide-upload-icon lucide-upload"
  >
    <path
      bind:this={shaftEl}
      d="M12 3v12"
      stroke-dasharray="30"
      stroke-dashoffset="30"
    />
    <path
      bind:this={headEl}
      d="m17 8-5-5-5 5"
    />
    <path
      bind:this={trayEl}
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      stroke-dasharray="60"
      stroke-dashoffset="60"
    />
  </svg>
</div>
