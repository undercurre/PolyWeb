import vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import checker from 'vite-plugin-checker';

export default {
  plugins: [
    vue(),
    Unocss({
      mode: 'vue-scoped'
    }),
    vueJsx(),
    checker({
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
  ],
  css: {
    postcss: {
      plugins: [require('postcss-preset-env')()]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "../src/assets/style/main.scss";`
      }
    }
  }
};
