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
  let topLineEl: SVGPathElement;
  let midLineEl: SVGPathElement;
  let curveEl: SVGPathElement;
  let notchEl: SVGPathElement;
  let diagonalEl: SVGPathElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Group settle animation
    if (groupEl) {
      groupEl.animate([
        { transform: 'scale(1) translate(0px, 0px)' },
        { transform: 'scale(1.05) translate(-1px, -1px)' },
        { transform: 'scale(1) translate(0px, 0px)' }
      ], {
        duration: 600,
        easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
      });
    }
    
    // Top line drawing (delayed)
    if (topLineEl) {
      setTimeout(() => {
        topLineEl.animate([
          { strokeDashoffset: topLineEl.getTotalLength() },
          { strokeDashoffset: '0' }
        ], {
          duration: 500,
          easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
        });
      }, 60);
    }
    
    // Mid line drawing (delayed)
    if (midLineEl) {
      setTimeout(() => {
        midLineEl.animate([
          { strokeDashoffset: midLineEl.getTotalLength() },
          { strokeDashoffset: '0' }
        ], {
          duration: 500,
          easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
        });
      }, 160);
    }
    
    // Curve drawing (delayed)
    if (curveEl) {
      setTimeout(() => {
        curveEl.animate([
          { strokeDashoffset: curveEl.getTotalLength() },
          { strokeDashoffset: '0' }
        ], {
          duration: 800,
          easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
        });
      }, 260);
    }
    
    // Notch drawing (delayed)
    if (notchEl) {
      setTimeout(() => {
        notchEl.animate([
          { strokeDashoffset: notchEl.getTotalLength() },
          { strokeDashoffset: '0' }
        ], {
          duration: 450,
          easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
        });
      }, 420);
    }
    
    // Diagonal resolve (delayed)
    if (diagonalEl) {
      setTimeout(() => {
        diagonalEl.animate([
          { 
            strokeDashoffset: diagonalEl.getTotalLength(),
            transform: 'translate(-0.3px, -0.2px) scale(1)',
            opacity: '1' 
          },
          { 
            strokeDashoffset: '0',
            transform: 'translate(0.5px, 0.5px) scale(1.05)',
            opacity: '1' 
          },
          { 
            strokeDashoffset: '0',
            transform: 'translate(0px, 0px) scale(1)',
            opacity: '1' 
          }
        ], {
          duration: 600,
          easing: 'cubic-bezier(0.12, 1, 0.25, 1)'
        });
      }, 500);
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
    class="lucide lucide-indian-rupee-icon lucide-indian-rupee"
  >
    <g bind:this={groupEl}>
      <g opacity="0.3">
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="M9 13c6.667 0 6.667-10 0-10" />
        <path d="M6 13h3" />
        <path d="m6 13 8.5 8" />
      </g>

      <path
        bind:this={topLineEl}
        d="M6 3h12"
        stroke-dasharray={topLineEl?.getTotalLength() || 12}
        stroke-dashoffset={topLineEl?.getTotalLength() || 12}
      />
      <path
        bind:this={midLineEl}
        d="M6 8h12"
        stroke-dasharray={midLineEl?.getTotalLength() || 12}
        stroke-dashoffset={midLineEl?.getTotalLength() || 12}
      />
      <path
        bind:this={curveEl}
        d="M9 13c6.667 0 6.667-10 0-10"
        stroke-dasharray={curveEl?.getTotalLength() || 20}
        stroke-dashoffset={curveEl?.getTotalLength() || 20}
      />
      <path
        bind:this={notchEl}
        d="M6 13h3"
        stroke-dasharray={notchEl?.getTotalLength() || 3}
        stroke-dashoffset={notchEl?.getTotalLength() || 3}
      />
      <path
        bind:this={diagonalEl}
        d="m6 13 8.5 8"
        stroke-dasharray={diagonalEl?.getTotalLength() || 12}
        stroke-dashoffset={diagonalEl?.getTotalLength() || 12}
      />
    </g>
  </svg>
</div>
