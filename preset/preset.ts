import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import vueJsx from '@vitejs/plugin-vue-jsx';
import stylelint from 'vite-plugin-stylelint';

export default {
    plugins: [
        vue(),
        Unocss({
          mode: 'vue-scoped'
        }),
        vueJsx(),
        stylelint({
          fix: true,
          include: ['../src/**/*.scss'], // 包含 .scss 文件
        })
    ],
    css: {
        postcss: {
          plugins: [require('postcss-preset-env')()],
        },
        preprocessorOptions: {
            scss: {
              additionalData: `@import "../src/assets/style/main.scss";`
            }
        }
    },
};