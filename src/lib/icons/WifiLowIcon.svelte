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
			
			// Get the WiFi elements
			const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
			const signal = svgRef.querySelector('path[d*="M8.5 16.429"]');
			
			if (dot && signal) {
				// Create additional weaker signals to show signal search
				createWeakerSignals();
				
				// Phase 1: Signal searching and connecting
				setTimeout(() => {
					animateSignalSearch();
				}, 200);
				
				// Phase 2: Weak connection established
				setTimeout(() => {
					animateWeakConnection();
				}, duration * 0.4);
				
				// Phase 3: Signal strength fluctuation
				setTimeout(() => {
					animateSignalFluctuation();
				}, duration * 0.6);
			}
			
			// Set up cleanup
			currentAnimation = {
				cancel: () => {
					clearWeakerSignals();
					stopAllAnimations();
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
	
	function createWeakerSignals() {
		if (!svgRef) return;
		
		// Create 2 additional weaker signal arcs for the "searching" effect
		const weakerSignals = [
			{ radius: 7, opacity: 0.3, strokeWidth: '1.5' },
			{ radius: 10, opacity: 0.2, strokeWidth: '1' }
		];
		
		weakerSignals.forEach((signal, index) => {
			const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			arc.setAttribute('d', `M ${8.5 - signal.radius + 5} ${16.429 + signal.radius - 5} a ${signal.radius} ${signal.radius} 0 0 1 ${signal.radius * 2} 0`);
			arc.setAttribute('stroke', 'currentColor');
			arc.setAttribute('stroke-width', signal.strokeWidth);
			arc.setAttribute('stroke-linecap', 'round');
			arc.setAttribute('fill', 'none');
			arc.setAttribute('opacity', '0');
			arc.classList.add('weak-signal', `weak-${index}`);
			
			// Set initial properties
			const pathLength = arc.getTotalLength();
			arc.style.strokeDasharray = `${pathLength}`;
			arc.style.strokeDashoffset = `${pathLength}`;
			arc.style.filter = 'drop-shadow(0 0 1px currentColor)';
			
			svgRef.appendChild(arc);
		});
	}
	
	function animateSignalSearch() {
		if (!svgRef) return;
		
		const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
		const mainSignal = svgRef.querySelector('path[d*="M8.5 16.429"]');
		const weakSignals = svgRef.querySelectorAll('.weak-signal');
		
		// Dot starts pulsing to show "searching"
		if (dot) {
			(dot as SVGPathElement).animate([
				{ 
					opacity: '1',
					transform: 'scale(1)',
					filter: 'none'
				},
				{ 
					opacity: '0.4',
					transform: 'scale(1.3)',
					filter: 'drop-shadow(0 0 3px currentColor)'
				},
				{ 
					opacity: '1',
					transform: 'scale(1)',
					filter: 'drop-shadow(0 0 1px currentColor)'
				}
			], {
				duration: duration * 0.15,
				iterations: 3,
				easing: 'ease-in-out'
			});
		}
		
		// Weak signals appear briefly showing search attempts
		weakSignals.forEach((signal, index) => {
			const arc = signal as SVGPathElement;
			const pathLength = arc.getTotalLength();
			
			setTimeout(() => {
				arc.animate([
					{ 
						strokeDashoffset: `${pathLength}`, 
						opacity: '0',
						filter: 'drop-shadow(0 0 1px currentColor)'
					},
					{ 
						strokeDashoffset: '0', 
						opacity: index === 0 ? '0.3' : '0.2',
						filter: 'drop-shadow(0 0 2px currentColor)'
					},
					{ 
						strokeDashoffset: '0', 
						opacity: '0.1',
						filter: 'none'
					}
				], {
					duration: duration * 0.2,
					easing: 'ease-out'
				});
			}, index * 300);
		});
	}
	
	function animateWeakConnection() {
		if (!svgRef) return;
		
		const mainSignal = svgRef.querySelector('path[d*="M8.5 16.429"]');
		const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
		
		if (mainSignal) {
			const signal = mainSignal as SVGPathElement;
			const pathLength = signal.getTotalLength();
			
			// Main signal draws in with difficulty (stuttering effect)
			signal.style.strokeDasharray = `${pathLength}`;
			signal.style.strokeDashoffset = `${pathLength}`;
			signal.style.opacity = '0';
			
			signal.animate([
				{ 
					strokeDashoffset: `${pathLength}`, 
					opacity: '0',
					filter: 'none'
				},
				{ 
					strokeDashoffset: `${pathLength * 0.7}`, 
					opacity: '0.3',
					filter: 'drop-shadow(0 0 2px currentColor)'
				},
				{ 
					strokeDashoffset: `${pathLength * 0.5}`, 
					opacity: '0.1',
					filter: 'drop-shadow(0 0 1px currentColor)'
				},
				{ 
					strokeDashoffset: '0', 
					opacity: '0.7',
					filter: 'drop-shadow(0 0 3px currentColor)'
				}
			], {
				duration: duration * 0.3,
				easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				fill: 'forwards'
			});
		}
		
		// Dot shows successful but weak connection
		if (dot) {
			(dot as SVGPathElement).animate([
				{ 
					opacity: '1',
					transform: 'scale(1)',
					filter: 'drop-shadow(0 0 1px currentColor)'
				},
				{ 
					opacity: '0.8',
					transform: 'scale(1.1)',
					filter: 'drop-shadow(0 0 2px currentColor)'
				},
				{ 
					opacity: '1',
					transform: 'scale(1)',
					filter: 'none'
				}
			], {
				duration: duration * 0.2,
				easing: 'ease-in-out'
			});
		}
	}
	
	function animateSignalFluctuation() {
		if (!svgRef) return;
		
		const mainSignal = svgRef.querySelector('path[d*="M8.5 16.429"]');
		const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
		
		// Signal strength fluctuates showing weak connection
		if (mainSignal) {
			(mainSignal as SVGPathElement).animate([
				{ 
					opacity: '0.7',
					strokeWidth: '2',
					filter: 'drop-shadow(0 0 3px currentColor)'
				},
				{ 
					opacity: '0.3',
					strokeWidth: '1.5',
					filter: 'drop-shadow(0 0 1px currentColor)'
				},
				{ 
					opacity: '0.8',
					strokeWidth: '2',
					filter: 'drop-shadow(0 0 4px currentColor)'
				},
				{ 
					opacity: '0.4',
					strokeWidth: '1.5',
					filter: 'drop-shadow(0 0 1px currentColor)'
				},
				{ 
					opacity: '0.7',
					strokeWidth: '2',
					filter: 'drop-shadow(0 0 3px currentColor)'
				}
			], {
				duration: duration * 0.4,
				easing: 'ease-in-out'
			});
		}
		
		// Dot shows connection struggles
		if (dot) {
			(dot as SVGPathElement).animate([
				{ 
					opacity: '1',
					transform: 'scale(1)'
				},
				{ 
					opacity: '0.6',
					transform: 'scale(0.8)'
				},
				{ 
					opacity: '1',
					transform: 'scale(1.1)'
				},
				{ 
					opacity: '0.7',
					transform: 'scale(0.9)'
				},
				{ 
					opacity: '1',
					transform: 'scale(1)'
				}
			], {
				duration: duration * 0.4,
				easing: 'ease-in-out'
			});
		}
	}
	
	function clearWeakerSignals() {
		if (svgRef) {
			const weakSignals = svgRef.querySelectorAll('.weak-signal');
			weakSignals.forEach(signal => {
				signal.getAnimations().forEach(anim => anim.cancel());
				signal.remove();
			});
		}
	}
	
	function stopAllAnimations() {
		if (svgRef) {
			const allPaths = svgRef.querySelectorAll('path');
			allPaths.forEach(path => {
				(path as SVGPathElement).getAnimations().forEach(anim => anim.cancel());
			});
		}
	}
	
	function stopAnimation() {
		if (currentAnimation) {
			currentAnimation.cancel();
			currentAnimation = null;
		}
		
		if (svgRef) {
			isAnimating = false;
			
			// Clear dynamic weak signals
			clearWeakerSignals();
			stopAllAnimations();
			
			// Reset original elements
			const dot = svgRef.querySelector('path[d*="M12 20h.01"]');
			const signal = svgRef.querySelector('path[d*="M8.5 16.429"]');
			
			if (dot) {
				const dotElement = dot as SVGPathElement;
				dotElement.style.opacity = '1';
				dotElement.style.transform = '';
				dotElement.style.filter = '';
			}
			
			if (signal) {
				const signalElement = signal as SVGPathElement;
				signalElement.style.strokeDasharray = 'none';
				signalElement.style.strokeDashoffset = '';
				signalElement.style.opacity = '1';
				signalElement.style.strokeWidth = '2';
				signalElement.style.filter = '';
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
  aria-label="wifi-low-icon icon"
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
<path d="M12 20h.01" />
		<path d="M8.5 16.429a5 5 0 0 1 7 0"  />
  </svg>
</div>