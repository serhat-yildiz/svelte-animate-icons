<script lang="ts">
	interface Props {
		text: string;
		label: string;
		type: 'import' | 'component' | 'install' | 'cdn';
		size?: 'small' | 'medium';
	}
	
	let { text, label, type, size = 'medium' }: Props = $props();
	
	let copied = $state(false);
	let copyTimeout: number;
	
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			
			copied = true;
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		}
	}
	
	function getIcon() {
		switch (type) {
			case 'import':
				return `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>`;
			case 'component':
				return `<polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>`;
			case 'install':
				return `<circle cx="12" cy="12" r="10"/><polyline points="8,12 12,16 16,12"/><line x1="12" y1="8" x2="12" y2="16"/>`;
			case 'cdn':
				return `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`;
			default:
				return `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="m5 15-4-4 4-4"/>`;
		}
	}
	
	function getTypeColor() {
		switch (type) {
			case 'import':
				return 'blue';
			case 'component':
				return 'purple';
			case 'install':
				return 'green';
			case 'cdn':
				return 'orange';
			default:
				return 'gray';
		}
	}
</script>

<button 
	class="copy-button"
	class:copied
	class:small={size === 'small'}
	class:type-import={type === 'import'}
	class:type-component={type === 'component'}
	class:type-install={type === 'install'}
	class:type-cdn={type === 'cdn'}
	onclick={copyToClipboard}
	title={`Copy ${label}`}
>
	<div class="button-content">
		<div class="button-icon">
			{#if copied}
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<polyline points="20,6 9,17 4,12"/>
				</svg>
			{:else}
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					{@html getIcon()}
				</svg>
			{/if}
		</div>
		
		<span class="button-label">
			{copied ? 'Copied!' : label}
		</span>
	</div>
	
	{#if copied}
		<div class="success-animation"></div>
	{/if}
</button>

<style>
	.copy-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-secondary);
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-normal);
		overflow: hidden;
		min-height: 36px;
		text-align: center;
	}
	
	.copy-button.small {
		padding: var(--space-xs) var(--space-sm);
		font-size: 0.7rem;
		min-height: 32px;
	}
	
	.copy-button:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
		color: var(--text-primary);
		transform: translateY(-1px);
	}
	
	.copy-button.copied {
		background: rgba(74, 222, 128, 0.1);
		border-color: rgba(74, 222, 128, 0.3);
		color: #4ade80;
	}
	
	.button-content {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		position: relative;
		z-index: 1;
	}
	
	.button-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform var(--transition-normal);
	}
	
	.copy-button.copied .button-icon {
		transform: scale(1.1);
	}
	
	.button-label {
		font-weight: 500;
		white-space: nowrap;
	}
	
	.success-animation {
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(74, 222, 128, 0.3), transparent);
		animation: sweep 0.6s ease-out;
	}
	
	@keyframes sweep {
		from {
			left: -100%;
		}
		to {
			left: 100%;
		}
	}
	
	/* Type-specific styling */
	.copy-button.type-import:hover {
		border-color: rgba(59, 130, 246, 0.5);
		background: rgba(59, 130, 246, 0.1);
	}
	
	.copy-button.type-component:hover {
		border-color: rgba(168, 85, 247, 0.5);
		background: rgba(168, 85, 247, 0.1);
	}
	
	.copy-button.type-install:hover {
		border-color: rgba(34, 197, 94, 0.5);
		background: rgba(34, 197, 94, 0.1);
	}
	
	.copy-button.type-cdn:hover {
		border-color: rgba(249, 115, 22, 0.5);
		background: rgba(249, 115, 22, 0.1);
	}
	
	@media (max-width: 768px) {
		.copy-button {
			padding: var(--space-xs) var(--space-sm);
			font-size: 0.7rem;
			min-height: 32px;
		}
		
		.copy-button.small {
			padding: 0.25rem 0.5rem;
			font-size: 0.65rem;
			min-height: 28px;
		}
	}
	
	@media (max-width: 480px) {
		.button-label {
			display: none;
		}
		
		.copy-button {
			min-width: 32px;
			padding: var(--space-xs);
		}
		
		.copy-button.small {
			min-width: 28px;
			padding: 0.25rem;
		}
	}
</style>
