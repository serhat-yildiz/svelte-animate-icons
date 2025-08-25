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
  let headEl: SVGCircleElement;
  let cogGroupEl: SVGGElement;
  
  export function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Body drawing animation
    if (bodyEl) {
      bodyEl.animate([
        { strokeDashoffset: '40', opacity: '0.3' },
        { strokeDashoffset: '0', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-in-out'
      });
    }
    
    // Head scale animation
    if (headEl) {
      headEl.animate([
        { transform: 'scale(0.5)', opacity: '0' },
        { transform: 'scale(1.2)', opacity: '1' },
        { transform: 'scale(1)', opacity: '1' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
    }
    
    // Cog rotation and scale animation
    if (cogGroupEl) {
      cogGroupEl.animate([
        { transform: 'rotate(0deg) scale(0.9)', opacity: '1' },
        { transform: 'rotate(360deg) scale(1.2)', opacity: '1' },
        { transform: 'rotate(360deg) scale(1)', opacity: '1' }
      ], {
        duration: 1200,
        easing: 'ease-in-out'
      });
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
    class="lucide lucide-user-round-cog-icon lucide-user-round-cog"
  >
    <path
      bind:this={bodyEl}
      d="M2 21a8 8 0 0 1 10.434-7.62"
      stroke-dasharray="40"
      stroke-dashoffset="40"
    />

    <circle
      bind:this={headEl}
      cx="10"
      cy="8"
      r="5"
    />

    <g bind:this={cogGroupEl}>
      <circle cx="18" cy="18" r="3" />
      <path d="m14.305 19.53.923-.382" />
      <path d="m15.228 16.852-.923-.383" />
      <path d="m16.852 15.228-.383-.923" />
      <path d="m16.852 20.772-.383.924" />
      <path d="m19.148 15.228.383-.923" />
      <path d="m19.53 21.696-.382-.924" />
      <path d="m20.772 16.852.924-.383" />
      <path d="m20.772 19.148.924.383" />
    </g>
  </svg>
</div>
