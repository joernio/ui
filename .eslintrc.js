module.exports = {
  plugins: [
    'prettier',
    'react',
    'react-hooks',
    'compat',
    'jest'
  ],
  extends: [
    // 'airbnb',
    'airbnb-base',
    'prettier'
  ],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'error',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './babel.config.js',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
      typescript: {},
    },
    'import/parsers': {
      '@babel/eslint-parser': ['.js', '.jsx', '.json'],
    },
  },
};
