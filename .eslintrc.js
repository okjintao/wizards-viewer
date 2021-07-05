module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	plugins: [
		'@typescript-eslint/eslint-plugin',
		'jest',
		'simple-import-sort',
	],
	ignorePatterns: [
		'.*',
		'build',
		'node_modules',
	],
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:import/errors',
		'plugin:import/typescript',
		'plugin:import/warnings',
		'plugin:prettier/recommended',
		'prettier',
	],
	rules: {
		'@typescript-eslint/await-thenable': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-implied-eval': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unnecessary-type-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars-experimental': [
			'error',
			{ ignoredNamesRegex: '^_' },
		],
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/restrict-plus-operands': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/unbound-method': 'off',
		'no-unused-vars': 'off',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [['\\u0000', '^@?\\w', '^', '\\.']],
			},
		],
		'react/display-name': [0, { ignoreTranspilerName: true }],
	},
};
