# UATP

强集成前端项目模板

## Main

主框架：[Vue3 => 一套用于构建用户界面的渐进式框架](https://www.javascriptc.com/vue3js/api/)

自动引入：[unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)

状态管理：[Pinia => Pinia 是 Vue 的存储库](https://pinia.web3doc.top/introduction.html)

路由管理：[Vue-router => Vue Router 是 Vue.js 的官方路由](https://router.vuejs.org/zh/introduction.html)

构建工具：[Vite => 下一代前端开发与构建工具](https://vitejs.cn/)

CSS：[Sass => 一种 CSS 的预编译语言](https://www.sasscss.com/documentation),[Unocss => 即时按需的原子化css引擎](https://unocss.dev/)

PostCSS：[一个用 JavaScript 工具和插件转换 CSS 代码的工具](https://www.postcss.com.cn/)

- [postcss-px-to-viewport-8-plugin => 将 px 单位转换为视口单位的 (vw, vh, vmin, vmax) 的 PostCSS 插件.](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin)

- [postcss-preset-env => 允许您将现代CSS转换为大多数浏览器 可以理解，根据您的目标确定您需要的填充物 浏览器或运行时环境。](https://github.com/csstools/postcss-preset-env)

国际化：[Vue-i18n => Vue国际化插件](https://vue-i18n.intlify.dev/)

- 配置地址：src/locales

图标库：[iconify => 一个图标库](https://iconify.design/)

组件库：

- PC端 [Element Plus](https://element-plus.org/zh-CN/)
- 移动端 [Vant](https://vant-contrib.gitee.io/vant/#/zh-CN)
- [unplugin-vue-components => 让你不用手动引入组件，但是对于vant的函数式组件仍然需要手动](https://github.com/antfu/unplugin-vue-components)

工具集：

- [@vueuse/core => 基于Vue组合式API的实用工具集](https://www.vueusejs.com/)
- [lodash](https://lodash.com/)

## 开发辅助

代码规范：`ESLint、Prettier、Stylelint`，该模板由`vite-plugin-checker`提供控制台及vite overlay的规范报错提示。

提交规范：`Lint-staged、Husky、Commitizen、Commitlint、Changelog`

版本规范：

- `standard-version` => 处理版本迭代提交
- `@plugin-web-update-notification/vite` => 版本升级后弹窗告诉用户

**`.cz-config.js`配置提交交互**

IDE(建议使用VSCODE)规范：`.editorconfig`

调试工具

- vite-plugin-vue-devtools => 一个旨在增强 Vue 开发者体验的 Vite 插件
- vite-plugin-progress => 一个打包进度条

## 环境配置

支持dev、test、prod三种环境

## 工具包

### request => axios封装

### hooks

### utils

- crypto 加密解密
- storage 缓存处理
- typeof 类型识别
- treeHelper 树形转换
- number 数字转换
- pattern 策略模式

### mock

## 接口配置

配置地址：src/service

## 打包

- vite-plugin-svg-icons 生成svg图标雪碧图
- vite-plugin-compression 压缩
- rollup-plugin-visualizer 打包可视化分析器
