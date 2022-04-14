const fs = require('fs');
const webpackPaths = require('../configs/webpack.paths.js');

const srcNodeModulesPath = webpackPaths.srcNodeModulesPath;
const appNodeModulesPath = webpackPaths.appNodeModulesPath;

if (!fs.existsSync(srcNodeModulesPath) && fs.existsSync(appNodeModulesPath)) {
	fs.symlinkSync(appNodeModulesPath, srcNodeModulesPath, 'junction');
}
