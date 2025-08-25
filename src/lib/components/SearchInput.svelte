<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
	}
	
	let { value = $bindable(), placeholder = 'Search icons...' }: Props = $props();
	
	let inputElement: HTMLInputElement;
	
	function clearSearch() {
		value = '';
		inputElement?.focus();
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			clearSearch();
		}
	}
</script>

<div class="search-input">
	<div class="search-icon">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8"/>
			<path d="m21 21-4.35-4.35"/>
		</svg>
	</div>
	
	<input
		bind:this={inputElement}
		bind:value
		onkeydown={handleKeydown}
		type="text"
		{placeholder}
		class="input"
	/>
	
	{#if value}
		<button class="clear-btn" onclick={clearSearch} aria-label="Clear search">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="18" y1="6" x2="6" y2="18"/>
				<line x1="6" y1="6" x2="18" y2="18"/>
			</svg>
		</button>
	{/if}
</div>

<style>
	.search-input {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
	}
	
	.search-icon {
		position: absolute;
		left: var(--space-md);
		color: var(--text-tertiary);
		pointer-events: none;
		z-index: 1;
		display: flex;
		align-items: center;
	}
	
	.input {
		width: 100%;
		padding: var(--space-md) var(--space-md) var(--space-md) 3rem;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		color: var(--text-primary);
		font-size: 0.95rem;
		font-family: inherit;
		outline: none;
		transition: all var(--transition-normal);
		backdrop-filter: blur(12px);
	}
	
	.input::placeholder {
		color: var(--text-tertiary);
	}
	
	.input:focus {
		border-color: var(--svelte-primary);
		box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
		background: rgba(255, 255, 255, 0.08);
	}
	
	.clear-btn {
		position: absolute;
		right: var(--space-md);
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: var(--radius-sm);
		color: var(--text-tertiary);
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.clear-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		color: var(--text-primary);
	}
	
	@media (max-width: 768px) {
		.input {
			font-size: 16px; /* Prevents zoom on iOS */
			padding: var(--space-md) var(--space-md) var(--space-md) 2.8rem;
		}
		
		.search-icon {
			left: var(--space-sm);
		}
		
		.clear-btn {
			right: var(--space-sm);
		}
	}
</style>
