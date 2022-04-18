const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.base.js');
const webpackPaths = require('./webpack.paths.js');
const checkNodeEnv = require('../scripts/check-node-env.js');

APP_DIR = path.join(webpackPaths.rootPath, './src/renderer');
const MONACO_DIR = path.join(
	webpackPaths.rootPath,
	'./node_modules/monaco-editor',
);
const XTERM_DIR = path.join(webpackPaths.rootPath, './node_modules/xterm');

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === 'production') {
	checkNodeEnv('development');
}

const configuration = {
	watchOptions: {
		ignored: ['**/release', '**/node_modules'],
	},

	devtool: 'inline-source-map',

	mode: 'development',

	// target: ['web', 'electron-renderer'],
	target: 'electron-renderer',

	entry: {
		worker: [path.join(webpackPaths.srcRendererWorkerPath, 'index.js')],
		main: [path.join(webpackPaths.srcRendererPath, 'index.js')],
	},

	output: {
		path: path.join(webpackPaths.distRendererPath, './'),
		publicPath: path.join(webpackPaths.distRendererPath, './'),
		filename: '[name].renderer.dev.js',
		// library: {
		//   type: 'umd',
		// },
	},

	module: {
		rules: [
			{
				test: [/\.s[ac]ss$/i, /\.css$/i],
				include: APP_DIR,
				use: [
					// Creates `style` nodes from JS strings
					'style-loader',
					// Translates CSS into CommonJS
					'css-loader',
					// Compiles Sass to CSS
					'sass-loader',
				],
			},
			{
				test: /\.css$/,
				include: MONACO_DIR,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.css$/,
				include: XTERM_DIR,
				use: ['style-loader', 'css-loader'],
			},
			// Fonts
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			// Images
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new MonacoWebpackPlugin({
			languages: [
				'abap',
				'apex',
				'azcli',
				'bat',
				'cameligo',
				'clojure',
				'coffee',
				'cpp',
				'csharp',
				'csp',
				'css',
				'dart',
				'dockerfile',
				'ecl',
				'fsharp',
				'go',
				'graphql',
				'handlebars',
				'hcl',
				'html',
				'ini',
				'java',
				'javascript',
				'json',
				'julia',
				'kotlin',
				'less',
				'lexon',
				'lua',
				'm3',
				'markdown',
				'mips',
				'msdax',
				'mysql',
				'objective-c',
				'pascal',
				'pascaligo',
				'perl',
				'pgsql',
				'php',
				'postiats',
				'powerquery',
				'powershell',
				'pug',
				'python',
				'r',
				'razor',
				'redis',
				'redshift',
				'restructuredtext',
				'ruby',
				'rust',
				'sb',
				'scala',
				'scheme',
				'scss',
				'shell',
				'solidity',
				'sophia',
				'sql',
				'st',
				'swift',
				'systemverilog',
				'tcl',
				'twig',
				'typescript',
				'vb',
				'xml',
				'yaml',
			],
			features: [
				'accessibilityHelp',
				'anchorSelect',
				'bracketMatching',
				'caretOperations',
				'clipboard',
				'codeAction',
				'codelens',
				'colorPicker',
				'comment',
				'contextmenu',
				'coreCommands',
				'cursorUndo',
				'dnd',
				'documentSymbols',
				'find',
				'folding',
				'fontZoom',
				'format',
				'gotoError',
				'gotoLine',
				'gotoSymbol',
				'hover',
				'iPadShowKeyboard',
				'inPlaceReplace',
				'indentation',
				'inlineHints',
				'inspectTokens',
				'linesOperations',
				'linkedEditing',
				'links',
				'multicursor',
				'parameterHints',
				'quickCommand',
				'quickHelp',
				'quickOutline',
				'referenceSearch',
				'rename',
				'smartSelect',
				'snippets',
				'suggest',
				'toggleHighContrast',
				'toggleTabFocusMode',
				'transpose',
				'unusualLineTerminators',
				'viewportSemanticTokens',
				'wordHighlighter',
				'wordOperations',
				'wordPartOperations',
			],
		}),

		new webpack.NoEmitOnErrorsPlugin(),

		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 *
		 * By default, use 'development' as NODE_ENV. This can be overriden with
		 * 'staging', for example, by changing the ENV variables in the npm scripts
		 */
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
		}),

		new webpack.LoaderOptionsPlugin({
			debug: true,
		}),

		new HtmlWebpackPlugin({
			filename: path.join('index.html'),
			template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
			inject: false,
			minify: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
			},
			isBrowser: false,
			env: process.env.NODE_ENV,
			isDevelopment: process.env.NODE_ENV !== 'production',
			nodeModules: webpackPaths.appNodeModulesPath,
		}),
	],

	node: {
		__dirname: false,
		__filename: false,
	},
};

module.exports = merge(baseConfig, configuration);
