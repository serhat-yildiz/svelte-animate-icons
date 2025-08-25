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
  let keyPathEl: SVGPathElement;
  let headCircleEl: SVGCircleElement;
  let biteGroupEl: SVGGElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Group sway animation
    if (groupEl) {
      groupEl.animate([
        { transform: 'rotate(0deg) scale(1)' },
        { transform: 'rotate(-2deg) scale(1.02)' },
        { transform: 'rotate(2deg) scale(1.02)' },
        { transform: 'rotate(0deg) scale(1)' }
      ], {
        duration: 700,
        easing: 'ease-in-out'
      });
    }
    
    // Key path drawing animation
    if (keyPathEl) {
      keyPathEl.animate([
        { strokeDashoffset: '140', opacity: '0.4' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });
    }
    
    // Head circle pulse animation (delayed)
    if (headCircleEl) {
      setTimeout(() => {
        headCircleEl.animate([
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1.12) rotate(-8deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1.12) rotate(8deg)', transformOrigin: '16.5px 7.5px' },
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '16.5px 7.5px' }
        ], {
          duration: 600,
          easing: 'ease-in-out'
        });
      }, 450);
    }
    
    // Bite nudge animation (delayed)
    if (biteGroupEl) {
      setTimeout(() => {
        biteGroupEl.animate([
          { transform: 'translate(0px, 0px)' },
          { transform: 'translate(1.2px, -0.6px)' },
          { transform: 'translate(0px, 0px)' }
        ], {
          duration: 450,
          easing: 'ease-in-out'
        });
      }, 550);
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
    class="lucide lucide-key-round-icon lucide-key-round"
  >
    <g bind:this={groupEl}>
      <path
        bind:this={keyPathEl}
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
        stroke-dasharray="140"
        stroke-dashoffset="140"
      />
      <g bind:this={biteGroupEl}>
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172" />
      </g>
      <circle
        bind:this={headCircleEl}
        cx="16.5"
        cy="7.5"
        r=".5"
        fill="currentColor"
      />
    </g>
  </svg>
</div>
