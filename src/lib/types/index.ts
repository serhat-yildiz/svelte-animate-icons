// Animation system types
export interface AnimationTriggers {
  hover?: boolean;
  click?: boolean;
  focus?: boolean;
  custom?: boolean;
}

export interface AnimationDefinition {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

export interface AnimationVariants {
  normal: AnimationDefinition;
  animate: AnimationDefinition;
  [key: string]: AnimationDefinition;
}

// Icon component types
export interface IconHandle {
  start(): Promise<void>;
  stop(): void;
  toggle(): void;
  isAnimating(): boolean;
  // Legacy methods for backward compatibility
  startAnimation(): Promise<void>;
  stopAnimation(): void;
}

export interface IconProps {
  size?: number;
  class?: string;
  className?: string; // For backward compatibility
  triggers?: AnimationTriggers;
  animationState?: 'idle' | 'loading' | 'success' | 'error' | 'active' | 'running';
  duration?: number;
  loop?: boolean;
}

// Icon metadata for registry
export interface IconMetadata {
  name: string;
  keywords: string[];
  animationType: 'transform' | 'path' | 'multi-element' | 'property';
  component: () => Promise<any>;
}
