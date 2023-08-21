module.exports = {
  plugins: {
    "postcss-px-to-viewport": {
      unitToConvert: "rpx",
      viewportWidth: 200,
      unitPrecision: 5,
      propList: ["*"],
      viewportUnit: "px",
      fontViewportUnit: "px",
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
      exclude: undefined,
      include: undefined,
      landscape: false,
    },
    "postcss-preset-env": {
      stage: 3,
    },
  },
  "@dcloudio/vue-cli-plugin-uni/packages/postcss": {},
};
