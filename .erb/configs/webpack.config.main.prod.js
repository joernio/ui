/**
 * Webpack config for production electron main process
 */

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config.base.js');
const webpackPaths = require('./webpack.paths.js');
const checkNodeEnv = require('../scripts/check-node-env.js');
const deleteSourceMaps = require('../scripts/delete-source-maps.js');

checkNodeEnv('production');
deleteSourceMaps();

const devtoolsConfig =
	process.env.DEBUG_PROD === 'true'
		? {
				devtool: 'source-map',
		  }
		: {};

const configuration = {
	...devtoolsConfig,

	mode: 'production',

	target: 'electron-main',

	entry: {
		main: path.join(webpackPaths.srcMainPath, 'main.js'),
		// preload: path.join(webpackPaths.srcMainPath, 'preload.js'),
	},

	output: {
		path: webpackPaths.distMainPath,
		filename: '[name].prod.js',
    clean: true
	},

  module: {
		rules: [
			// Images
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
			},
		],
	},

	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
		],
	},

	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode:
				process.env.ANALYZE === 'true' ? 'server' : 'disabled',
			analyzerPort: 'auto',
		}),

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
			NODE_ENV: 'production',
			DEBUG_PROD: false,
			START_MINIMIZED: false,
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
