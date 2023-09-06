import uni from '@dcloudio/vite-plugin-uni';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Unocss from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Checker from 'vite-plugin-checker';

export default [
	uni(),
	vueJsx(),
	AutoImport({
		imports: ['vue', 'pinia', 'vue-i18n'],
		dts: './types/auto-imports.d.ts',
		dirs: ['src/pages/**/*', 'src/components/**/*', 'src/stores/**/*'],
		eslintrc: {
			enabled: true
		},
		resolvers: []
	}),
	Components({
		dts: './types/components.d.ts',
		types: [],
		resolvers: []
	}),
	Unocss({
		mode: 'vue-scoped'
	})
	// Checker({
	// 	vueTsc: true,
	// 	typescript: true,
	// 	eslint: {
	// 		lintCommand:
	// 			'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --ignore-path .gitignore'
	// 	},
	// 	stylelint: {
	// 		lintCommand: "stylelint 'src/**/*.{vue,scss,html}'"
	// 	}
	// })
];
