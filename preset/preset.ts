import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import vueJsx from '@vitejs/plugin-vue-jsx';

export default {
    plugins: [
        vue(),
        Unocss({
          mode: 'vue-scoped'
        }),
        vueJsx(),
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