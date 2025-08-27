<script lang="ts">
	import { clsx } from 'clsx';
	
	interface AnimationTriggers {
		hover?: boolean;
		click?: boolean;
		focus?: boolean;
		custom?: boolean;
	}
	
	interface Props {
		size?: number;
		class?: string;
		triggers?: AnimationTriggers;
		animationState?: 'idle' | 'active' | 'loading' | 'success' | 'error';
		autoPlay?: boolean;
		loop?: boolean;
		duration?: number;
		onAnimationStart?: () => void;
		onAnimationEnd?: () => void;
		[key: string]: any;
	}
	
	let { 
		size = 28, 
		class: className, 
		triggers = { hover: true },
		animationState = 'idle',
		autoPlay = false,
		loop = false,
		duration = 2000,
		onAnimationStart,
		onAnimationEnd,
		...restProps 
	}: Props = $props();
	
	export interface IconHandle {
		startAnimation: () => void;
		stopAnimation: () => void;
		toggleAnimation: () => void;
		setAnimationState: (newState: string) => void;
		readonly isAnimating: boolean;
	}
	
	let containerRef: HTMLDivElement;
	let svgRef: SVGSVGElement;
	let isAnimating = $state(false);
	let currentAnimation: Animation | null = null;
	let currentState = $state(animationState);
	function startAnimation() {
		if (svgRef && !isAnimating) {
			stopAnimation(); 
			
			isAnimating = true;
			onAnimationStart?.();
			
			// Create dynamic WiFi signal arcs that will disappear
			createWifiSignals();
			
			const dot = svgRef.querySelector('path');
			if (dot) {
				// Phase 1: WiFi signals appear and fluctuate
				setTimeout(() => {
					animateWifiSignalLoss();
				}, 200);
				
				// Phase 2: Dot pulses as signals disappear
				setTimeout(() => {
					animateDotPulse();
				}, duration * 0.6);
			}
			
			// Set up cleanup
			currentAnimation = {
				cancel: () => {
					clearDynamicElements();
				},
				addEventListener: (event: string, callback: () => void) => {
					if (event === 'finish') {
						setTimeout(() => {
							if (!loop && !autoPlay && currentState !== 'loading') {
								stopAnimation();
							}
							onAnimationEnd?.();
						}, duration);
					}
				}
			} as Animation;
			
			// Auto-finish handling
			setTimeout(() => {
				if (!loop && !autoPlay && currentState !== 'loading') {
					stopAnimation();
				}
				onAnimationEnd?.();
			}, duration);
		}
	}
	
	function createWifiSignals() {
		if (!svgRef) return;
		
		// Create 3 concentric WiFi arcs
		const signals = [
			{ radius: 6, opacity: 0.8, delay: 0 },
			{ radius: 9, opacity: 0.6, delay: 100 },
			{ radius: 12, opacity: 0.4, delay: 200 }
		];
		
		signals.forEach((signal, index) => {
			const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			arc.setAttribute('d', `M ${12 - signal.radius} ${20 - signal.radius} Q 12 ${20 - signal.radius * 1.5} ${12 + signal.radius} ${20 - signal.radius}`);
			arc.setAttribute('stroke', 'currentColor');
			arc.setAttribute('stroke-width', '2');
			arc.setAttribute('stroke-linecap', 'round');
			arc.setAttribute('fill', 'none');
			arc.setAttribute('opacity', '0');
			arc.classList.add('wifi-signal', `signal-${index}`);
			
			// Set initial dash properties
			const pathLength = arc.getTotalLength();
			arc.style.strokeDasharray = `${pathLength}`;
			arc.style.strokeDashoffset = `${pathLength}`;
			arc.style.filter = 'drop-shadow(0 0 2px currentColor)';
			
			svgRef.appendChild(arc);
		});
	}
	
	function animateWifiSignalLoss() {
		if (!svgRef) return;
		
		const signals = svgRef.querySelectorAll('.wifi-signal');
		
		// Phase 1: Signals appear
		signals.forEach((signal, index) => {
			const arc = signal as SVGPathElement;
			const pathLength = arc.getTotalLength();
			
			setTimeout(() => {
				// Draw in the signal
				arc.animate([
					{ 
						strokeDashoffset: `${pathLength}`, 
						opacity: '0',
						transform: 'scale(0.8)',
						filter: 'drop-shadow(0 0 2px currentColor)'
					},
					{ 
						strokeDashoffset: '0', 
						opacity: index === 0 ? '0.8' : index === 1 ? '0.6' : '0.4',
						transform: 'scale(1)',
						filter: 'drop-shadow(0 0 4px currentColor)'
					}
				], {
					duration: duration * 0.3,
					easing: 'ease-out',
					fill: 'forwards'
				});
			}, index * 150);
		});
		
		// Phase 2: Signals flicker and weaken
		setTimeout(() => {
			signals.forEach((signal, index) => {
				const arc = signal as SVGPathElement;
				
				arc.animate([
					{ opacity: index === 0 ? '0.8' : index === 1 ? '0.6' : '0.4' },
					{ opacity: '0.2' },
					{ opacity: index === 0 ? '0.6' : index === 1 ? '0.4' : '0.2' },
					{ opacity: '0.1' },
					{ opacity: index === 0 ? '0.4' : index === 1 ? '0.2' : '0.1' }
				], {
					duration: duration * 0.3,
					easing: 'ease-in-out'
				});
			});
		}, duration * 0.3);
		
		// Phase 3: Signals disappear one by one (furthest first)
		setTimeout(() => {
			[...signals].reverse().forEach((signal, index) => {
				const arc = signal as SVGPathElement;
				
				setTimeout(() => {
					arc.animate([
						{ 
							opacity: arc.style.opacity || '0.4',
							transform: 'scale(1)',
							filter: 'drop-shadow(0 0 4px currentColor)'
						},
						{ 
							opacity: '0',
							transform: 'scale(0.7)',
							filter: 'none'
						}
					], {
						duration: duration * 0.2,
						easing: 'ease-in',
						fill: 'forwards'
					});
				}, index * 200);
			});
		}, duration * 0.5);
	}
	
	function animateDotPulse() {
		const dot = svgRef?.querySelector('path[d*="M12 20h.01"]');
		if (!dot) return;
		
		// Dot becomes more prominent as signals disappear
		(dot as SVGPathElement).animate([
			{ 
				opacity: '1',
				transform: 'scale(1)',
				filter: 'none'
			},
			{ 
				opacity: '0.5',
				transform: 'scale(1.5)',
				filter: 'drop-shadow(0 0 3px currentColor)'
			},
			{ 
				opacity: '1',
				transform: 'scale(1)',
				filter: 'drop-shadow(0 0 1px currentColor)'
			},
			{ 
				opacity: '0.7',
				transform: 'scale(1.2)',
				filter: 'drop-shadow(0 0 2px currentColor)'
			},
			{ 
				opacity: '1',
				transform: 'scale(1)',
				filter: 'none'
			}
		], {
			duration: duration * 0.4,
			easing: 'ease-in-out'
		});
	}
	
	function clearDynamicElements() {
		if (svgRef) {
			const signals = svgRef.querySelectorAll('.wifi-signal');
			signals.forEach(signal => {
				signal.getAnimations().forEach(anim => anim.cancel());
				signal.remove();
			});
			
			const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
			if (dot) {
				(dot as SVGPathElement).getAnimations().forEach(anim => anim.cancel());
			}
		}
	}
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			// Clear dynamic WiFi signals
			clearDynamicElements();
			
			// Reset the original dot
			const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
			if (dot) {
				const dotElement = dot as SVGPathElement;
				dotElement.style.opacity = '1';
				dotElement.style.transform = '';
				dotElement.style.filter = '';
				dotElement.getAnimations().forEach(anim => anim.cancel());
			}
		}
	}
	
	function toggleAnimation() {
		if (isAnimating) {
			stopAnimation();
		} else {
			startAnimation();
		}
	}
	
	function setAnimationState(newState: string) {
		currentState = newState as any;
		
		
		switch (newState) {
			case 'active':
			case 'loading':
				startAnimation();
				break;
			case 'idle':
			case 'success':
			case 'error':
			default:
				stopAnimation();
				break;
		}
	}
	
	
	function handleMouseEnter() {
		if (triggers.hover && !triggers.custom) {
			startAnimation();
		}
	}
	
	function handleMouseLeave() {
		if (triggers.hover && !triggers.custom) {
			stopAnimation();
		}
	}
	
	function handleClick() {
		if (triggers.click) {
			toggleAnimation();
		}
	}
	
	function handleFocus() {
		if (triggers.focus) {
			startAnimation();
		}
	}
	
	function handleBlur() {
		if (triggers.focus) {
			stopAnimation();
		}
	}
	
	
	$effect(() => {
		if (svgRef) {
			setAnimationState(animationState);
		}
	});
	
	
	$effect(() => {
		if (autoPlay && svgRef) {
			startAnimation();
		}
		
		
		return () => {
			stopAnimation();
		};
	});
	
	
	export function start() {
		startAnimation();
	}
	
	export function stop() {
		stopAnimation();
	}
	
	export function toggle() {
		toggleAnimation();
	}
	
	export function setState(state: string) {
		setAnimationState(state);
	}
	
	export function getIconStatus() {
		return {
			isAnimating,
			currentState
		};
	}
</script>
<div 
  bind:this={containerRef}
  class={clsx('inline-flex', className)}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onclick={handleClick}
  onfocus={handleFocus}
  onblur={handleBlur}
  role={triggers.click || triggers.focus ? 'button' : 'img'}
  aria-label="wifi-zero-icon icon"
  {...restProps}
>
  <svg
    bind:this={svgRef}
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
<path d="M12 20h.01"  />
  </svg>
</div>