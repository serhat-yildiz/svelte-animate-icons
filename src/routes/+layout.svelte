<script lang="ts">
	import '../app.css';
</script>

<div class="app">
	<slot />
</div>

<style>
	:global(html) {
		height: 100%;
	}
	
	:global(body) {
		height: 100%;
		margin: 0;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
		color: white;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	.app {
		min-height: 100vh;
		position: relative;
	}
	
	:global(*) {
		box-sizing: border-box;
	}
	
	:global(button) {
		cursor: pointer;
		border: none;
		background: none;
		font-family: inherit;
	}
	
	:global(input) {
		font-family: inherit;
	}
</style>