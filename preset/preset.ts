import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

export default [
  uni(),
  AutoImport({
    imports: ["vue"],
    dts: "./types/auto-imports.d.ts",
    dirs: ["src/pages/**/*", "src/components/**/*"],
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
];
