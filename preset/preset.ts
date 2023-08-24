import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Unocss from "unocss/vite";

export default [
  uni(),
  AutoImport({
    imports: ["vue", "pinia", "vue-i18n"],
    dts: "./types/auto-imports.d.ts",
    dirs: ["src/pages/**/*", "src/components/**/*", "src/stores/**/*"],
    eslintrc: {
      enabled: true,
    },
    resolvers: [],
  }),
  Components({
    dts: "./types/components.d.ts",
    types: [],
    resolvers: [],
  }),
  Unocss({
    mode: "vue-scoped",
  }),
];
