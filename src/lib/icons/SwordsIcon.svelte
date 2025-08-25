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
  let paths: (SVGPolylineElement | SVGLineElement)[] = [];
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG rotation and scale animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-5deg) scale(1.05)' },
        { transform: 'rotate(5deg) scale(0.95)' },
        { transform: 'rotate(-3deg) scale(1)' },
        { transform: 'rotate(3deg) scale(1)' },
        { transform: 'rotate(0deg) scale(1)' }
      ], {
        duration: 1500,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Path drawing animations (continuous)
    paths.forEach((path) => {
      if (path) {
        path.animate([
          { strokeDashoffset: path.getTotalLength(), opacity: '0.6' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 1200,
          easing: 'ease-in-out',
          iterations: Infinity
        });
      }
    });
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, ...paths].forEach(el => {
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
    <polyline
      bind:this={paths[0]}
      points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"
      stroke-dasharray={paths[0]?.getTotalLength() || 30}
      stroke-dashoffset={paths[0]?.getTotalLength() || 30}
    />
    <line
      bind:this={paths[1]}
      x1="13" x2="19" y1="19" y2="13"
      stroke-dasharray={paths[1]?.getTotalLength() || 8}
      stroke-dashoffset={paths[1]?.getTotalLength() || 8}
    />
    <line
      bind:this={paths[2]}
      x1="16" x2="20" y1="16" y2="20"
      stroke-dasharray={paths[2]?.getTotalLength() || 6}
      stroke-dashoffset={paths[2]?.getTotalLength() || 6}
    />
    <line
      bind:this={paths[3]}
      x1="19" x2="21" y1="21" y2="19"
      stroke-dasharray={paths[3]?.getTotalLength() || 3}
      stroke-dashoffset={paths[3]?.getTotalLength() || 3}
    />
    <polyline
      bind:this={paths[4]}
      points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"
      stroke-dasharray={paths[4]?.getTotalLength() || 20}
      stroke-dashoffset={paths[4]?.getTotalLength() || 20}
    />
    <line 
      bind:this={paths[5]}
      x1="5" x2="9" y1="14" y2="18" 
      stroke-dasharray={paths[5]?.getTotalLength() || 6}
      stroke-dashoffset={paths[5]?.getTotalLength() || 6}
    />
    <line 
      bind:this={paths[6]}
      x1="7" x2="4" y1="17" y2="20" 
      stroke-dasharray={paths[6]?.getTotalLength() || 4}
      stroke-dashoffset={paths[6]?.getTotalLength() || 4}
    />
    <line 
      bind:this={paths[7]}
      x1="3" x2="5" y1="19" y2="21" 
      stroke-dasharray={paths[7]?.getTotalLength() || 3}
      stroke-dashoffset={paths[7]?.getTotalLength() || 3}
    />
  </svg>
</div>
