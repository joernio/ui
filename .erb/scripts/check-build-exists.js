// Check if the renderer and main bundles are built
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const webpackPaths = require('../configs/webpack.paths');

const mainPath = path.join(webpackPaths.distMainPath, 'main.dev.js');
const rendererPath = path.join(
	webpackPaths.distRendererPath,
	'main.renderer.dev.js',
);

if (!fs.existsSync(mainPath)) {
	throw new Error(
		chalk.whiteBright.bgRed.bold(
			'The main process is not built yet. Build it by running "npm run build:main:dev:no-watch"',
		),
	);
}

if (!fs.existsSync(rendererPath)) {
	throw new Error(
		chalk.whiteBright.bgRed.bold(
			'The renderer process is not built yet. Build it by running "npm run build:renderer:dev:no-watch"',
		),
	);
}
