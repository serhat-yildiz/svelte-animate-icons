import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: [
				// Allow serving files from one level up to the project root
				'..',
				// Allow serving files from the dist directory
				'./dist'
			]
		}
	}
});