module.exports = {
	parser: '@babel/eslint-parser',
	plugins: [
		'import',
		'prettier',
		'react',
		'react-hooks',
		'compat',
		'jest',
		'json',
	],
	extends: [
		// 'airbnb',
		'airbnb-base',
		'prettier',
		'plugin:react/recommended',
		'plugin:jest/recommended',
		'plugin:import/recommended',
	],
	globals: {
		document: 'readonly',
		window: 'readonly',
		ResizeObserver: 'readonly',
	},
	rules: {
		// A temporary hack related to IDE not resolving correct package.json
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'error',
		// Since React 17 and typescript 4.1 you can safely disable the rule
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'no-param-reassign': 'off',
		'no-shadow': 'off',
		camelcase: 'off',
		'consistent-return': 'off',
		'no-nested-ternary': 'off',
		'prefer-destructuring': 'off',
		'no-unused-expressions': 'off',
		'no-promise-executor-return': 'off',
		'func-names': 'off',
		'default-param-last': 'off',
		'import/prefer-default-export': 'off',
		'import/no-cycle': 'off',
		'import/no-self-import': 'off',
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'off',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './babel.config.js',
		tsconfigRootDir: __dirname,
		createDefaultProgram: true,
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
	},
	settings: {
		'import/resolver': {
			// See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
			node: {
				extensions: ['.js', '.jsx', '.json'],
			},
			webpack: {
				config: require.resolve(
					'./.erb/configs/webpack.config.eslint.js',
				),
			},
			typescript: {},
		},
		// 'import/parsers': {
		// 	'@babel/eslint-parser': ['.js', '.jsx', '.json'],
		// },
	},
};
