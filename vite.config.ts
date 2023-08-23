import { defineConfig } from "vite";
import preset from "./preset/preset";
import pxToViewport from "postcss-px-to-viewport-8-plugin";
import postcssPresetEnv from "postcss-preset-env";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [...preset],
  css: {
    postcss: {
      plugins: [
        pxToViewport({
          viewportWidth: 1280,
          unitPrecision: 6,
          unitToConvert: "px",
          propList: ["*"],
        }),
        postcssPresetEnv({
          stage: 3, // 使用的 CSS 语法阶段
        }),
      ],
    },
  },
});
