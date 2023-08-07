import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import preset from './preset/preset';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [...preset],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "src/assets/styles/index.scss";`
			}
		}
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
