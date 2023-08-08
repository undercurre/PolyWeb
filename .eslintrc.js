/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'plugin:vue/vue3-essential',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting'
	],
	overrides: [
		{
			files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
			extends: ['plugin:cypress/recommended']
		}
	],
	parserOptions: {
		ecmaVersion: 'latest'
	},
	rules: {
		'no-unused-vars': 0
	}
};
