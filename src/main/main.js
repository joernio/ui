/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */

import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';
import { initIpcMain } from './ipcMain';

function initIpcAndWindow() {
	initIpcMain();
	createWindow();
}

function init() {
	app.on('ready', () => {
		initIpcAndWindow();
	});

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			initIpcAndWindow();
		}
	});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});
}

init();

//  mainWindow.on('ready-to-show', () => {
//    if (!mainWindow) {
//      throw new Error('"mainWindow" is not defined');
//    }
//    if (process.env.START_MINIMIZED) {
//      mainWindow.minimize();
//    } else {
//      mainWindow.show();
//    }
//  });

//  mainWindow.on('closed', () => {
//    mainWindow = null;
//  });
//  };
