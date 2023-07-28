import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import vueJsx from '@vitejs/plugin-vue-jsx';

export default {
    plugins: [
        vue(),
        Unocss({
          mode: 'vue-scoped'
        }),
        vueJsx()
    ],
    css: {
        postcss: {
          plugins: [require('postcss-preset-env')()],
        },
        preprocessorOptions: {
            scss: {
              // 配置你的 SCSS 文件路径，例如引入全局的 variables.scss
              additionalData: `@import "../src/assets/main.scss";`
            }
        }
    },
};