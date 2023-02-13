/* eslint import/no-mutable-exports: off */
import path from 'path';
import { app, clipboard } from 'electron';
import { URL } from 'url';
import { createRequire } from 'module';

export const require = createRequire(import.meta.url);

export const isDev = () => process.env.NODE_ENV === 'development' ||
	process.env.DEBUG_PROD === 'true' ||
	!app.isPackaged;

export const getDirName = url => path.dirname(new URL(url).pathname);

// const resourcesPath = () => isDev()
// 	? path.resolve(getDirName(import.meta.url), '..','..','assets')
// 	: path.join(process.resourcesPath, 'assets');

// export const getAssetPath = (...paths) => path.join(resourcesPath(), ...paths);

const getFullPath = filename => isDev() ?
	path.resolve(
		getDirName(import.meta.url),
		'..',
		'..',
		'release',
		'app',
		'dist',
		'renderer',
		filename,
	) : path.join(process.resourcesPath, 'app.asar/dist/renderer', filename);

export const resolveHtmlPath = htmlFileName =>
	`file://${getFullPath(htmlFileName)}`;

export const handleClipBoardActivity = (type, value) => {
	if (type === 'copy') {
		clipboard.writeText(value);
	} else if (type === 'paste') {
		return clipboard.readText();
	}
};
