import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default [
	vue(),
	Unocss({
		mode: 'vue-scoped'
	}),
	vueJsx(),
	AutoImport({
		imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n', 'pinia'],
		dts: './types/auto-imports.d.ts',
		dirs: ['src/components', 'src/views'],
		eslintrc: {
			enabled: true
		},
		resolvers: [ElementPlusResolver()]
	}),
	Components({
		dts: './types/components.d.ts',
		types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
		resolvers: [VantResolver(), ElementPlusResolver()]
	}),
	Checker({
		vueTsc: true,
		typescript: true,
		eslint: {
			lintCommand:
				'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore'
		},
		stylelint: {
			lintCommand: "stylelint 'src/**/*.{vue,scss,html}'"
		}
	})
];
