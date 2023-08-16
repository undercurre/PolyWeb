import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import preset from './preset/preset';
import path from 'node:path';

import { visualizer } from 'rollup-plugin-visualizer';
import { configDefaults } from 'vitest/config';

import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig((configEnv) => {
	const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as ImportMetaEnv;

	const plugins = [...preset, uni()];

	if (viteEnv.VITE_VISUALIZER === 'Y') {
		plugins.push(
			visualizer({
				gzipSize: true,
				brotliSize: true,
				open: true
			})
		);
	}

	return {
		base: process.env.VITE_BASE_URL || '/',
		plugins,
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
		},
		test: {
			environment: 'jsdom',
			exclude: [...configDefaults.exclude, 'e2e/*'],
			root: fileURLToPath(new URL('./', import.meta.url)),
			transformMode: {
				web: [/\.[jt]sx$/]
			}
		}
	};
});
