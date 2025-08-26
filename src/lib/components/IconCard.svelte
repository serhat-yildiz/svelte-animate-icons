<script lang="ts">
	import type { RegistryIconMetadata } from '../registry/iconRegistry.js';
	import CopyButton from './CopyButton.svelte';
	
	interface Props {
		icon: RegistryIconMetadata;
	}
	
	let { icon }: Props = $props();
	
	// Icon ref for manual control
	let iconRef: any;
	
	// Card hover handlers
	function handleCardMouseEnter() {
		if (iconRef && iconRef.start) {
			iconRef.start();
		}
	}
	
	function handleCardMouseLeave() {
		if (iconRef && iconRef.stop) {
			iconRef.stop();
		}
	}
	

	
	// Generate component name for copy actions
	const componentName = icon.name.split('-').map(word => 
		word.charAt(0).toUpperCase() + word.slice(1)
	).join('') + 'Icon';
	
	const copyOptions = [
		{
			label: 'Import',
			code: `import { ${componentName} } from 'svelte-animate-icons';`,
			type: 'import' as const
		},
		{
			label: 'Basic',
			code: `<${componentName} size={24} />`,
			type: 'component' as const
		},
		{
			label: 'Advanced',
			code: `<${componentName} triggers={{ click: true }} animationState="loading" autoPlay />`,
			type: 'component' as const
		},
		{
			label: 'Install',
			code: `npm install svelte-animate-icons`,
			type: 'install' as const
		}
	];
</script>

<div class="icon-card glass" onmouseenter={handleCardMouseEnter} onmouseleave={handleCardMouseLeave}>
	<div class="card-header">
		<!-- Icon Preview -->
		<div class="icon-preview">
			<svelte:component 
				this={icon.component}
				bind:this={iconRef}
				size={40} 
				triggers={{ custom: true }}
			/>
		</div>
		
		<!-- Icon Info -->
		<div class="icon-info">
			<h3 class="icon-name">{icon.name}</h3>
			<p class="icon-description">{icon.description}</p>
			
			<!-- Keywords -->
			<div class="icon-keywords">
				{#each icon.keywords.slice(0, 3) as keyword}
					<span class="keyword">{keyword}</span>
				{/each}
				{#if icon.keywords.length > 3}
					<span class="keyword-more">+{icon.keywords.length - 3}</span>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Animation Info -->
	<div class="animation-info">
		<span class="info-text">Hover to see animation • Check docs for advanced usage</span>
	</div>
	
	<!-- Copy Actions -->
	<div class="copy-actions">
		{#each copyOptions as option}
			<CopyButton 
				text={option.code}
				label={option.label}
				type={option.type}
				size="small"
			/>
		{/each}
	</div>
</div>

<style>
	.icon-card {
		padding: var(--space-lg);
		border-radius: var(--radius-xl);
		transition: all var(--transition-normal);
		position: relative;
		overflow: hidden;
		min-height: 280px;
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
	
	.icon-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 62, 0, 0.5), transparent);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}
	
	.icon-card:hover {
		border-color: rgba(255, 62, 0, 0.3);
		background: rgba(255, 255, 255, 0.08);
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
	}
	
	.icon-card:hover::before {
		opacity: 1;
	}
	
	.card-header {
		display: flex;
		gap: var(--space-md);
		align-items: flex-start;
		flex: 1;
	}
	
	.icon-preview {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		color: var(--svelte-primary);
		transition: all var(--transition-normal);
		flex-shrink: 0;
	}
	
	.animation-info {
		text-align: center;
		margin: var(--space-sm) 0;
	}
	
	.info-text {
		font-size: 0.75rem;
		color: var(--text-tertiary);
		font-style: italic;
	}
	
	.icon-info {
		flex: 1;
		min-width: 0;
	}
	
	.icon-name {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 var(--space-sm);
		color: var(--text-primary);
		word-break: break-word;
	}
	
	.icon-description {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin: 0 0 var(--space-md);
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.icon-keywords {
		display: flex;
		gap: var(--space-xs);
		flex-wrap: wrap;
	}
	
	.keyword {
		font-size: 0.7rem;
		background: rgba(255, 255, 255, 0.1);
		color: var(--text-tertiary);
		padding: 0.2em 0.5em;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		white-space: nowrap;
	}
	
	.keyword-more {
		font-size: 0.7rem;
		background: rgba(255, 62, 0, 0.1);
		color: var(--svelte-primary);
		padding: 0.2em 0.5em;
		border-radius: 8px;
		border: 1px solid rgba(255, 62, 0, 0.2);
		white-space: nowrap;
		font-weight: 600;
	}
	

	
	
	
	.copy-actions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-xs);
	}
	
	@media (max-width: 768px) {
		.icon-card {
			padding: var(--space-md);
			min-height: 240px;
		}
		
		.card-header {
			gap: var(--space-sm);
		}
		
		.icon-preview {
			width: 56px;
			height: 56px;
		}
		
		.copy-actions {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-xs);
		}
		

	}
	
	@media (max-width: 480px) {
		.icon-card {
			padding: var(--space-sm);
			min-height: 220px;
		}
		
		.icon-preview {
			width: 48px;
			height: 48px;
		}
		
		.icon-name {
			font-size: 0.9rem;
		}
		
		.icon-description {
			font-size: 0.8rem;
			-webkit-line-clamp: 1;
			line-clamp: 1;
		}
		
		.copy-actions {
			grid-template-columns: 1fr;
		}
		
		.control-btn {
			padding: var(--space-xs) var(--space-sm);
			font-size: 0.75rem;
		}
	}
</style>
