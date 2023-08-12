import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import { viteMockServe } from 'vite-plugin-mock';
import ViteCompression from 'vite-plugin-compression';
import progress from 'vite-plugin-progress';
import VueDevtools from 'vite-plugin-vue-devtools';
import { webUpdateNotice } from '@plugin-web-update-notification/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

export default [
	vue(),
	Unocss({
		mode: 'vue-scoped'
	}),
	vueJsx(),
	createSvgIconsPlugin({
		iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
		symbolId: `icon-[dir]-[name]`,
		inject: 'body-last',
		customDomId: '__SVG_ICON_LOCAL__'
	}),
	AutoImport({
		imports: ['vue', 'vue-router', '@vueuse/core', 'vue-i18n', 'pinia'],
		dts: './types/auto-imports.d.ts',
		dirs: ['src/components', 'src/views', 'src/stores'],
		eslintrc: {
			enabled: true
		},
		resolvers: [ElementPlusResolver()]
	}),
	Icons({
		compiler: 'vue3', // 适应vue3依赖
		customCollections: {
			custom: FileSystemIconLoader('./src/assets/svg') // 自定义目录
		},
		autoInstall: true // 自动安装
	}),
	Components({
		dts: './types/components.d.ts',
		types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
		resolvers: [
			VantResolver(),
			ElementPlusResolver(),
			IconsResolver({ customCollections: ['custom'] })
		]
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
	}),
	viteMockServe({
		mockPath: 'mock',
		prodEnabled: true,
		injectCode: `
			import { setupMockServer } from '../mock';
			setupMockServer();
		`
	}),
	ViteCompression({ algorithm: 'gzip', deleteOriginFile: true }),
	progress(),
	VueDevtools(),
	webUpdateNotice({
		logVersion: true,
		versionType: 'pkg_version'
	})
];
