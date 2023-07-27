import vue from "@vitejs/plugin-vue";
import Unocss from "unocss/vite";
import vueJsx from '@vitejs/plugin-vue-jsx'

export default [
    vue(),
    Unocss(),
    vueJsx()
];