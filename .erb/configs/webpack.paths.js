const path = require('path');

const rootPath = path.join(__dirname, '../..');
const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcRendererWorkerPath = path.join(srcRendererPath, 'worker_scripts');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');

const buildPath = path.join(releasePath, 'build');

module.exports = {
	rootPath,
	srcPath,
	srcMainPath,
	srcRendererPath,
	srcRendererWorkerPath,
	releasePath,
	appPath,
	appPackagePath,
	appNodeModulesPath,
	srcNodeModulesPath,
	distPath,
	distMainPath,
	distRendererPath,
	buildPath,
};
