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
  let tile1El: SVGRectElement;
  let tile2El: SVGRectElement;
  let tile3El: SVGRectElement;
  let tile4El: SVGRectElement;
  let sweepEl: SVGRectElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Grid variants animation
    if (groupEl) {
      groupEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.03) rotate(1deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Tile animations with stagger
    const tiles = [tile1El, tile2El, tile3El, tile4El];
    tiles.forEach((tile, index) => {
      if (tile) {
        setTimeout(() => {
          tile.animate([
            { opacity: '0.4', transform: 'scale(0.85)' },
            { opacity: '1', transform: 'scale(1.08)' },
            { opacity: '1', transform: 'scale(1)' }
          ], {
            duration: 550,
            easing: 'ease-out'
          });
        }, 80 * index);
      }
    });
    
    // Sweep animation (delayed)
    if (sweepEl) {
      setTimeout(() => {
        sweepEl.animate([
          { transform: 'translate(-26px, -26px)', opacity: '0' },
          { transform: 'translate(0px, 0px)', opacity: '0.35' },
          { transform: 'translate(26px, 26px)', opacity: '0' }
        ], {
          duration: 800,
          easing: 'ease-in-out'
        });
      }, 100);
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
    class="lucide lucide-layout-grid-icon lucide-layout-grid"
  >
    <defs>
      <linearGradient id="grid-sweep" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="currentColor" stop-opacity="0" />
        <stop offset="50%" stop-color="currentColor" stop-opacity="0.35" />
        <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <g bind:this={groupEl}>
      <rect
        bind:this={tile1El}
        width="7"
        height="7"
        x="3"
        y="3"
        rx="1"
      />
      <rect
        bind:this={tile2El}
        width="7"
        height="7"
        x="14"
        y="3"
        rx="1"
      />
      <rect
        bind:this={tile3El}
        width="7"
        height="7"
        x="14"
        y="14"
        rx="1"
      />
      <rect
        bind:this={tile4El}
        width="7"
        height="7"
        x="3"
        y="14"
        rx="1"
      />

      <rect
        bind:this={sweepEl}
        x="2"
        y="2"
        width="20"
        height="20"
        rx="3"
        fill="url(#grid-sweep)"
        style="pointer-events: none; opacity: 0;"
      />
    </g>
  </svg>
</div>
