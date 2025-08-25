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
  let leftChainEl: SVGPathElement;
  let rightChainEl: SVGPathElement;
  let sparks: SVGLineElement[] = [];
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Left chain movement
    if (leftChainEl) {
      leftChainEl.animate([
        { transform: 'translateX(0px) rotate(0deg)' },
        { transform: 'translateX(-2px) rotate(-5deg)' },
        { transform: 'translateX(-4px) rotate(-8deg)' },
        { transform: 'translateX(-2px) rotate(-5deg)' },
        { transform: 'translateX(0px) rotate(0deg)' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Right chain movement
    if (rightChainEl) {
      rightChainEl.animate([
        { transform: 'translateX(0px) rotate(0deg)' },
        { transform: 'translateX(2px) rotate(5deg)' },
        { transform: 'translateX(4px) rotate(8deg)' },
        { transform: 'translateX(2px) rotate(5deg)' },
        { transform: 'translateX(0px) rotate(0deg)' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Sparks animation
    sparks.forEach((spark) => {
      if (spark) {
        spark.animate([
          { strokeDashoffset: spark.getTotalLength(), opacity: '0' },
          { strokeDashoffset: '0', opacity: '1' },
          { strokeDashoffset: '0', opacity: '0' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }
    });
    
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
      bind:this={rightChainEl}
      d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
    />
    <path
      bind:this={leftChainEl}
      d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
    />

    <line
      bind:this={sparks[0]}
      x1="8" x2="8" y1="2" y2="5"
      stroke-dasharray={sparks[0]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[0]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[1]}
      x1="2" x2="5" y1="8" y2="8"
      stroke-dasharray={sparks[1]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[1]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[2]}
      x1="16" x2="16" y1="19" y2="22"
      stroke-dasharray={sparks[2]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[2]?.getTotalLength() || 3}
    />
    <line
      bind:this={sparks[3]}
      x1="19" x2="22" y1="16" y2="16"
      stroke-dasharray={sparks[3]?.getTotalLength() || 3}
      stroke-dashoffset={sparks[3]?.getTotalLength() || 3}
    />
  </svg>
</div>
