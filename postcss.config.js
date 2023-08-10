module.exports = {
	plugins: {
		'postcss-px-to-viewport-8-plugin': {
			viewportWidth: 1280,
			unitPrecision: 6,
			unitToConvert: 'px',
			propList: ['*']
		},
		'postcss-preset-env': {
			stage: 3
		}
	}
};
