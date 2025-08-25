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
  let swayGroupEl: SVGGElement;
  let dotEl: SVGPathElement;
  let bar1El: SVGPathElement;
  let bar2El: SVGPathElement;
  let bar3El: SVGPathElement;
  let bar4El: SVGPathElement;
  let bar1BreatheEl: SVGPathElement;
  let bar2BreatheEl: SVGPathElement;
  let bar3BreatheEl: SVGPathElement;
  let bar4BreatheEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // SVG animation
    if (svgEl) {
      svgEl.animate([
        { transform: 'scale(1) rotate(0deg) translateY(0px)' },
        { transform: 'scale(1.06) rotate(-2deg) translateY(-1px)' },
        { transform: 'scale(1) rotate(2deg) translateY(0px)' },
        { transform: 'scale(1) rotate(0deg) translateY(0px)' }
      ], {
        duration: 900,
        easing: 'ease-in-out'
      });
    }
    
    // Sway group animation
    if (swayGroupEl) {
      swayGroupEl.animate([
        { transform: 'rotate(0deg) translate(0px, 0px) scale(1)' },
        { transform: 'rotate(-2deg) translate(-0.4px, -0.3px) scale(1.018)' },
        { transform: 'rotate(1deg) translate(0.2px, 0.1px) scale(1)' },
        { transform: 'rotate(0deg) translate(0px, 0px) scale(1)' }
      ], {
        duration: 700,
        easing: 'ease-in-out'
      });
    }
    
    // Dot kick animation (delayed)
    if (dotEl) {
      setTimeout(() => {
        dotEl.animate([
          { transform: 'scale(1)', opacity: '1' },
          { transform: 'scale(1.18)', opacity: '1' },
          { transform: 'scale(1)', opacity: '1' }
        ], {
          duration: 300,
          easing: 'ease-out'
        });
      }, 60);
    }
    
    // Bar bounce animations (staggered)
    const bars = [bar1El, bar2El, bar3El, bar4El];
    bars.forEach((bar, index) => {
      if (bar) {
        setTimeout(() => {
          bar.animate([
            { transform: 'translateY(0px) scaleY(1)', transformOrigin: 'center bottom', opacity: '1' },
            { transform: 'translateY(-0.8px) scaleY(1.1)', transformOrigin: 'center bottom', opacity: '1' },
            { transform: 'translateY(0px) scaleY(1)', transformOrigin: 'center bottom', opacity: '1' }
          ], {
            duration: 420,
            easing: 'ease-out'
          });
        }, 60 + (index * 60));
      }
    });
    
    // Bar breathe animations (delayed)
    const breatheBars = [bar1BreatheEl, bar2BreatheEl, bar3BreatheEl, bar4BreatheEl];
    breatheBars.forEach((bar, index) => {
      if (bar) {
        setTimeout(() => {
          bar.animate([
            { transform: 'scaleY(1)', transformOrigin: 'center bottom' },
            { transform: 'scaleY(1.04)', transformOrigin: 'center bottom' },
            { transform: 'scaleY(1)', transformOrigin: 'center bottom' }
          ], {
            duration: 500,
            easing: 'ease-in-out'
          });
        }, 320 + (index * 40));
      }
    });
    
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
    class="lucide lucide-signal-icon lucide-signal"
  >
    <g bind:this={swayGroupEl}>
      <path
        bind:this={dotEl}
        d="M2 20h.01"
      />
      <g>
        <path bind:this={bar1El} d="M7 20v-4" />
        <path bind:this={bar2El} d="M12 20v-8" />
        <path bind:this={bar3El} d="M17 20V8" />
        <path bind:this={bar4El} d="M22 4v16" />
      </g>
      <g>
        <path bind:this={bar1BreatheEl} d="M7 20v-4" />
        <path bind:this={bar2BreatheEl} d="M12 20v-8" />
        <path bind:this={bar3BreatheEl} d="M17 20V8" />
        <path bind:this={bar4BreatheEl} d="M22 4v16" />
      </g>
    </g>
  </svg>
</div>
