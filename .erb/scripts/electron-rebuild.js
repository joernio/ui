const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');
const webpackPaths = require('../configs/webpack.paths.js');
const { dependencies } = require('../../release/app/package.json');

if (
	Object.keys(dependencies || {}).length > 0 &&
	fs.existsSync(webpackPaths.appNodeModulesPath)
) {
	const electronRebuildCmd =
		'../../node_modules/.bin/electron-rebuild --module-dir .';
	const cmd =
		process.platform === 'win32'
			? electronRebuildCmd.replace(/\//g, '\\')
			: electronRebuildCmd;
	execSync(cmd, {
		cwd: webpackPaths.appPath,
		stdio: 'inherit',
	});
}
