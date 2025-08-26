<script lang="ts">
  import { BicepsFlexedIcon } from '$lib';
	import { getAvailableIcons, getCategoriesWithCounts } from '../registry/iconRegistry.js';
	import IconCard from './IconCard.svelte';
	import SearchInput from './SearchInput.svelte';
	
	let searchQuery = $state('');
	let selectedCategory = $state('all');
	
	// Get data from registry - make these reactive
	const allIcons = $derived(getAvailableIcons());
	const categories = $derived(getCategoriesWithCounts());
	
	// Simple filtered icons calculation
	const filteredIcons = $derived.by(() => {
		// Start with all icons
		let icons = allIcons;
		
		// Filter by category if not 'all'
		if (selectedCategory !== 'all') {
			icons = icons.filter(icon => icon.category === selectedCategory);
		}
		
		// Filter by search query if not empty
		if (searchQuery.trim()) {
			const searchTerm = searchQuery.toLowerCase().trim();
			icons = icons.filter(icon => {
				return (
					icon.name.toLowerCase().includes(searchTerm) ||
					icon.description.toLowerCase().includes(searchTerm) ||
					icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
				);
			});
		}
		

		
		return icons;
	});
	
	function clearFilters() {
		searchQuery = '';
		selectedCategory = 'all';
	}
</script>

<section id="gallery" class="gallery-section">
	<div class="container">
		<!-- Section Header -->
		<div class="section-header">
			<h2 class="section-title">
				<div class="title-icon">
					<BicepsFlexedIcon size={32} triggers={{ hover: true }} />
				</div>
				<span class="text-gradient">Icon Gallery</span>
			</h2>
			<p class="section-description">
				Browse our collection of {allIcons.length} beautiful animated icons. 
				Search by name or browse by category to find the perfect icon for your project.
			</p>
		</div>
		
		<!-- Filters -->
		<div class="filters-section">
			<div class="filters-row">
				<!-- Search -->
				<div class="search-container">
					<SearchInput bind:value={searchQuery} placeholder="Search {allIcons.length} icons..." />
				</div>
				
				<!-- Category Filter -->
				<div class="category-filter">
					<div class="category-scroll">
						{#each categories as category}
							<button
								class="category-btn"
								class:active={selectedCategory === category.id}
								onclick={() => selectedCategory = category.id}
							>
								<span class="category-label">{category.label}</span>
								<span class="category-count">{category.count}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>
			
			<!-- Active Filters & Results -->
			<div class="filter-status">
				<div class="results-count">
					<span class="count">{filteredIcons.length}</span>
					<span class="label">{filteredIcons.length === 1 ? 'icon' : 'icons'}</span>
					{#if searchQuery || selectedCategory !== 'all'}
						<span class="filter-indicator">filtered</span>
					{/if}
				</div>
				
				{#if searchQuery || selectedCategory !== 'all'}
					<button class="clear-filters" onclick={clearFilters}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/>
							<line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
						Clear filters
					</button>
				{/if}
			</div>
		</div>
		
		<!-- Icons Grid -->
		<div class="icons-grid">
			{#each filteredIcons as icon (icon.id)}
				<IconCard {icon} />
			{:else}
				<div class="empty-state">
					<div class="empty-icon">
						<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<circle cx="11" cy="11" r="8"/>
							<path d="m21 21-4.35-4.35"/>
						</svg>
					</div>
					<h3>No icons found</h3>
					<p>Try adjusting your search query or category filter.</p>
					<button class="btn-secondary" onclick={clearFilters}>
						Clear filters
					</button>
				</div>
			{/each}
		</div>
		
		{#if filteredIcons.length > 0}
			<!-- Load More (Future Enhancement) -->
			<div class="gallery-footer">
				<div class="load-info">
					<p>Showing all {filteredIcons.length} icons</p>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.gallery-section {
		padding: var(--space-3xl) 0;
		background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
		min-height: 100vh;
	}
	
	.section-header {
		text-align: center;
		margin-bottom: var(--space-3xl);
	}
	
	.section-title {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		font-size: clamp(2rem, 5vw, 2.5rem);
		font-weight: 700;
		margin: 0 0 var(--space-lg);
		line-height: 1.2;
	}
	
	.title-icon {
		color: var(--svelte-primary);
		flex-shrink: 0;
	}
	
	.section-description {
		font-size: clamp(1rem, 2vw, 1.125rem);
		color: var(--text-secondary);
		margin: 0 auto;
		max-width: 600px;
		line-height: 1.6;
	}
	
	.filters-section {
		margin-bottom: var(--space-2xl);
		padding: var(--space-xl);
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(12px);
	}
	
	.filters-row {
		display: flex;
		gap: var(--space-lg);
		margin-bottom: var(--space-lg);
		align-items: flex-start;
	}
	
	.search-container {
		flex: 1;
		min-width: 0;
	}
	
	.category-filter {
		flex: 2;
		min-width: 0;
	}
	
	.category-scroll {
		display: flex;
		gap: var(--space-sm);
		overflow-x: auto;
		padding: var(--space-sm) 0;
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	
	.category-scroll::-webkit-scrollbar {
		display: none;
	}
	
	.category-btn {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all var(--transition-normal);
		white-space: nowrap;
		flex-shrink: 0;
	}
	
	.category-btn:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--text-primary);
		border-color: rgba(255, 62, 0, 0.2);
	}
	
	.category-btn.active {
		background: var(--svelte-primary);
		color: white;
		border-color: var(--svelte-primary);
		box-shadow: 0 4px 12px rgba(255, 62, 0, 0.3);
	}
	
	.category-label {
		font-weight: 500;
	}
	
	.category-count {
		font-size: 0.75rem;
		background: rgba(255, 255, 255, 0.2);
		padding: 0.2em 0.5em;
		border-radius: 12px;
		font-weight: 600;
		min-width: 1.5rem;
		text-align: center;
	}
	
	.category-btn.active .category-count {
		background: rgba(255, 255, 255, 0.3);
	}
	
	.filter-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-lg);
		border-top: 1px solid var(--glass-border);
	}
	
	.results-count {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.875rem;
	}
	
	.count {
		font-weight: 700;
		color: var(--svelte-primary);
		font-size: 1rem;
	}
	
	.label {
		color: var(--text-secondary);
	}
	
	.filter-indicator {
		background: rgba(255, 62, 0, 0.1);
		color: var(--svelte-primary);
		padding: 0.2em 0.6em;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		border: 1px solid rgba(255, 62, 0, 0.2);
	}
	
	.clear-filters {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		background: transparent;
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-md);
		padding: var(--space-sm) var(--space-md);
		color: var(--text-secondary);
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-normal);
	}
	
	.clear-filters:hover {
		background: rgba(255, 255, 255, 0.05);
		color: var(--text-primary);
		border-color: rgba(255, 62, 0, 0.2);
	}
	
	.icons-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-lg);
		margin-bottom: var(--space-2xl);
	}
	
	.empty-state {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-3xl) var(--space-lg);
		text-align: center;
		background: var(--glass-bg);
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-xl);
		backdrop-filter: blur(12px);
	}
	
	.empty-icon {
		margin-bottom: var(--space-lg);
		opacity: 0.5;
		color: var(--text-tertiary);
	}
	
	.empty-state h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0 0 var(--space-sm);
		color: var(--text-primary);
	}
	
	.empty-state p {
		color: var(--text-secondary);
		margin: 0 0 var(--space-lg);
		max-width: 400px;
	}
	
	.gallery-footer {
		text-align: center;
		padding: var(--space-xl);
		border-top: 1px solid var(--glass-border);
	}
	
	.load-info p {
		color: var(--text-tertiary);
		margin: 0;
		font-size: 0.875rem;
	}
	
	@media (max-width: 768px) {
		.filters-section {
			padding: var(--space-lg);
		}
		
		.filters-row {
			flex-direction: column;
			gap: var(--space-md);
		}
		
		.filter-status {
			flex-direction: column;
			gap: var(--space-md);
			align-items: flex-start;
		}
		
		.icons-grid {
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
		
		.category-scroll {
			gap: var(--space-xs);
		}
		
		.category-btn {
			font-size: 0.8rem;
			padding: var(--space-xs) var(--space-sm);
		}
	}
	
	@media (max-width: 480px) {
		.gallery-section {
			padding: var(--space-2xl) 0;
		}
		
		.filters-section {
			padding: var(--space-md);
			margin-bottom: var(--space-lg);
		}
		
		.empty-state {
			padding: var(--space-2xl) var(--space-md);
		}
		
		.empty-icon {
			font-size: 3rem;
		}
		
		.category-btn .category-label {
			display: none;
		}
	}
</style>
