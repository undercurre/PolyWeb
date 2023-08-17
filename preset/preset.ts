import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from 'unplugin-auto-import/vite';

export default [
		uni(),
		AutoImport({
			imports: ['vue'],
			dts: './types/auto-imports.d.ts',
			dirs: ['src/pages/**/*', 'src/components/**/*'],
			eslintrc: {
				enabled: true
			},
			resolvers: []
		}),
]