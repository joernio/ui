/**
 * Base webpack config used across other specific configs
 */

const webpack = require('webpack');
const webpackPaths = require('./webpack.paths.js');
const { dependencies: externals } = require('../../release/app/package.json');

const configuration = {
	externals: [...Object.keys(externals || {})],

	stats: 'errors-only',

	module: {
		rules: [
			{
				test: /\.[j]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/preset-env',
								{
									targets: {
										esmodules: true,
									},
								},
							],
							'@babel/preset-react',
						],
					},
				},
			},
		],
	},

	output: {
		path: webpackPaths.srcPath,
		// https://github.com/webpack/webpack/issues/1114
		library: {
			type: 'commonjs2',
		},
	},

	/**
	 * Determine the array of extensions that should be used to resolve modules.
	 */
	resolve: {
		extensions: ['.js', '.jsx', '.json'],
		modules: [webpackPaths.srcPath, 'node_modules'],
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
		}),
	],
};

module.exports = configuration;
