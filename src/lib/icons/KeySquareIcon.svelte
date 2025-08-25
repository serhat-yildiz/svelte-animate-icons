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
  let linkPathEl: SVGPathElement;
  let miniLinkEl: SVGPathElement;
  let toothEl: SVGPathElement;
  let sparkEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Group settle animation
    if (groupEl) {
      groupEl.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.03) rotate(-3deg)' },
        { transform: 'scale(0.995) rotate(1deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Link pulse animation (slight delay)
    if (linkPathEl) {
      setTimeout(() => {
        linkPathEl.animate([
          { strokeDashoffset: linkPathEl.getTotalLength(), opacity: '0.6' },
          { strokeDashoffset: '0', opacity: '1' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 50);
    }
    
    // Tooth snap animation (delayed)
    if (toothEl) {
      setTimeout(() => {
        toothEl.animate([
          { transform: 'translate(0.4px, 0px)', opacity: '0.5' },
          { transform: 'translate(0px, -0.4px)', opacity: '1' },
          { transform: 'translate(0px, 0px)', opacity: '1' }
        ], {
          duration: 450,
          easing: 'ease-out'
        });
      }, 120);
    }
    
    // Mini link animation (delayed)
    if (miniLinkEl) {
      setTimeout(() => {
        miniLinkEl.animate([
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '12px 12px' },
          { transform: 'scale(1.06) rotate(-10deg)', transformOrigin: '12px 12px' },
          { transform: 'scale(1) rotate(0deg)', transformOrigin: '12px 12px' }
        ], {
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 180);
    }
    
    // Spark trail animation (delayed)
    if (sparkEl) {
      setTimeout(() => {
        sparkEl.animate([
          { strokeDashoffset: sparkEl.getTotalLength(), opacity: '0' },
          { strokeDashoffset: '0', opacity: '1' },
          { strokeDashoffset: '0', opacity: '0' }
        ], {
          duration: 400,
          easing: 'ease-out'
        });
      }, 360);
    }
    
    // Reset animation state
    setTimeout(() => {
      isAnimating = false;
    }, 1000);
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
    class="lucide lucide-key-square-icon lucide-key-square"
  >
    <g bind:this={groupEl}>
      <path
        bind:this={linkPathEl}
        d="M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"
        stroke-dasharray={linkPathEl?.getTotalLength() || 100}
        stroke-dashoffset={linkPathEl?.getTotalLength() || 100}
      />
      <path
        bind:this={miniLinkEl}
        d="m14 7 3 3"
      />
      <path
        bind:this={toothEl}
        d="m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"
      />
      <path
        bind:this={sparkEl}
        d="M10.1 13.9 L12.2 12.2"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-dasharray={sparkEl?.getTotalLength() || 10}
        stroke-dashoffset={sparkEl?.getTotalLength() || 10}
      />
    </g>
  </svg>
</div>
