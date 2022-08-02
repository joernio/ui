import { BrowserWindow } from 'electron';
import { getWindowPosition } from './config';
import { updateWindowInfo, openDevTools } from './ipcMain'; // eslint-disable-line no-unused-vars
import { require, isDev, getAssetPath, resolveHtmlPath } from './utils';

const installExtensions = async () => {
	const installer = require('electron-devtools-installer');
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
	const extensions = ['REACT_DEVELOPER_TOOLS'];

	return installer.default(
		extensions.map(name => installer[name]),
		forceDownload,
	);
};

const devSetup = async () => {
	if (process.env.NODE_ENV === 'production' && isDev) {
		const sourceMapSupport = require('source-map-support');
		sourceMapSupport.install();
	}

	if (isDev) {
		const debug = require('electron-debug');
		debug();
		await installExtensions();
	}
};

// const isMac = process.platform === 'darwin';

export const createWindow = async () => {
	// await devSetup();
	// devSetup(); //uncomment this line to keep devtools always open

	const { position, size } = getWindowPosition();

	const window = new BrowserWindow({
		title: 'CPG UI Client',
		// titleBarStyle: 'hiddenInset',
		icon: getAssetPath('icon.png'),
		frame: true,
		// transparent: isMac,
		acceptFirstMouse: true,
		webPreferences: {
			nodeIntegrationInWorker: true,
			nodeIntegration: true,
			worldSafeExecuteJavaScript: true,
			contextIsolation: false,
		},
		width: size[0],
		height: size[1],
		x: position[0] === -1 ? undefined : position[0], // if it's `-1` then don't set and
		y: position[1] === -1 ? undefined : position[1], // let electron center it by default
		minWidth: 370,
		minHeight: 190,
	});

	window.setMenuBarVisibility(false);

	updateWindowInfo(window);

	// openDevTools(window);

	window.loadURL(resolveHtmlPath('index.html'));

	// Open urls in the user's browser
	// window.webContents.setWindowOpenHandler((edata) => {
	//   shell.openExternal(edata.url);
	//   return { action: 'deny' };
	// });

	return window;
};
