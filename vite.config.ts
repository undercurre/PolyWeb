import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import preset from './preset/preset';
import path from 'node:path';

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
			'~': path.resolve(process.cwd()),
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
		}
	}
});
