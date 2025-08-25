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
  let sprayDots: SVGPathElement[] = [];
  
  const sprayPaths = [
    "M3 3h.01",
    "M7 5h.01", 
    "M11 7h.01",
    "M3 7h.01",
    "M7 9h.01",
    "M3 11h.01"
  ];
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG rotation animation (continuous)
    if (svgEl) {
      svgEl.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-4deg)' },
        { transform: 'rotate(4deg)' },
        { transform: 'rotate(-2deg)' },
        { transform: 'rotate(2deg)' },
        { transform: 'rotate(0deg)' }
      ], {
        duration: 2000,
        easing: 'ease-in-out',
        iterations: Infinity
      });
    }
    
    // Spray dots animations (staggered, continuous)
    sprayDots.forEach((dot, index) => {
      if (dot) {
        setTimeout(() => {
          dot.animate([
            { transform: 'scale(1) translateY(0px)', opacity: '1' },
            { transform: 'scale(1.3) translateY(-2px)', opacity: '0.4' },
            { transform: 'scale(0.7) translateY(2px)', opacity: '1' },
            { transform: 'scale(1) translateY(0px)', opacity: '1' }
          ], {
            duration: 1000,
            easing: 'ease-in-out',
            iterations: Infinity
          });
        }, index * 200);
      }
    });
  }
  
  export function stopAnimation() {
    isAnimating = false;
    // Stop all animations
    [svgEl, ...sprayDots].forEach(el => {
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
    {#each sprayPaths as path, i}
      <path bind:this={sprayDots[i]} d={path} />
    {/each}
    <rect width="4" height="4" x="15" y="5" />
    <path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" />
    <path d="m13 14 8-2" />
    <path d="m13 19 8-2" />
  </svg>
</div>
