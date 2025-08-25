// Animation system types
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
	startAnimation(): Promise<void>;
	stopAnimation(): void;
	isAnimating(): boolean;
}

export interface IconProps {
	size?: number;
	className?: string;
}

// Icon metadata for registry
export interface IconMetadata {
	name: string;
	keywords: string[];
	animationType: 'transform' | 'path' | 'multi-element' | 'property';
	component: () => Promise<any>;
}
