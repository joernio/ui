/**
 * Webpack config for production electron main process
 */

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const webpackPaths = require('./webpack.paths.js');
const checkNodeEnv = require('../scripts/check-node-env.js');

checkNodeEnv('development');

const configuration = {
	devtool: 'source-map',

	mode: 'development',

	target: 'electron-main',

	entry: {
		main: path.join(webpackPaths.srcMainPath, 'main.js'),
		// preload: path.join(webpackPaths.srcMainPath, 'preload.js'),
	},

	output: {
		path: webpackPaths.distMainPath,
		filename: '[name].dev.js',
	},

  module: {
		rules: [
			// Images
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},

	plugins: [
		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),
	],

	/**
	 * Disables webpack processing of __dirname and __filename.
	 * If you run the bundle in node.js it falls back to these values of node.js.
	 * https://github.com/webpack/webpack/issues/2010
	 */
	node: {
		__dirname: false,
		__filename: false,
	},
};

module.exports = merge(baseConfig, configuration);
