import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	
	compilerOptions: {
		runes: true
	},
	
	onwarn: (warning, handler) => {
		// Ignore a11y warnings during build
		if (warning.code.startsWith('a11y-')) {
			return;
		}
		handler(warning);
	},

	kit: {
		// GitHub Pages static adapter
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/svelte-animate-icons' : ''
		},
		alias: {
			'$lib': 'src/lib'
		}
	}
};

export default config;