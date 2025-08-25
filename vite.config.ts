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
	},
	build: {
		rollupOptions: {
			onwarn(warning, warn) {
				// Suppress a11y warnings during build
				if (warning.code === 'a11y-click-events-have-key-events' || 
				    warning.code === 'a11y-no-static-element-interactions' ||
				    warning.code === 'a11y-consider-explicit-label') {
					return;
				}
				warn(warning);
			}
		}
	}
});