// eslint-disable-line no-console
import { BrowserWindow, ipcMain, Notification, dialog } from 'electron';
import initWebSocket from './webSocket';
import { handleClipBoardActivity } from './utils';

export const getWindow = event => {
	const window = BrowserWindow.fromId(event.frameId);
	if (!window) throw new Error('Window not found');
	return window;
};

export const handleWindowAction = (action, window) => {
	switch (action) {
		case 'minimize':
			window.minimize();
			return true;
		case 'maximize':
			window.isMaximized() ? window.unmaximize() : window.maximize();
			return true;
		case 'unmaximize':
			window.unmaximize();
			return true;
		case 'reload':
			window.reload();
			return true;
		case 'close':
			window.close();
			return true;
		default:
			// eslint-disable-next-line no-console
			console.error(`Invalid window action: ${action}`);
			return false;
	}
};

export const initIpcMain = app => {
	// eslint-disable-next-line no-console
	console.log('starting to init ipc');

	ipcMain.on('import-certificate', (event, obj) => {
		const window = getWindow(event);
		app.importCertificate(
			{ certificate: obj.cert_path, password: obj.cert_passphrase },
			result => {
				if (result === 0) {
					window.webContents.send('certificate-import-success');
					setTimeout(
						() => handleWindowAction('reload', window),
						3000,
					);
				} else {
					window.webContents.send('certificate-import-error');
				}
			},
		);
	});

	ipcMain.on('websocket-connect', (event, ws_url) => {
		const window = getWindow(event);
		initWebSocket(window, ws_url);
	});

	ipcMain.on('window-action', (event, message) =>
		handleWindowAction(message, getWindow(event)),
	);

	ipcMain.on('get-window-info', event => {
		const window = getWindow(event);
		const info = {
			isMaximized: window.isMaximized(),
		};
		return info;
	});

	ipcMain.on('notify', (_, message) => {
		new Notification({ title: 'Notification', body: message }).show();
	});

	ipcMain.on('select-dir', async event => {
		const window = getWindow(event);
		const result = await dialog.showOpenDialog(window, {
			properties: ['openDirectory'],
		});

		window.webContents.send('selected-dir', result.filePaths[0]);
	});

	ipcMain.on('select-file', async event => {
		const window = getWindow(event);
		const result = await dialog.showOpenDialog(window, {
			properties: ['openFile'],
		});

		window.webContents.send('selected-file', result.filePaths[0]);
	});

	ipcMain.on('create-file', async (event, defaultPath) => {
		const window = getWindow(event);
		const file = await dialog.showSaveDialog(window, {
			title: 'Save',
			defaultPath,
			filters: [
				{
					name: '.sc files',
					extensions: ['sc'],
				},
			],
			properties: [
				'showHiddenFiles',
				'createDirectory',
				'showOverwriteConfirmation',
			],
		});

		window.webContents.send('created-file', file);
	});

	ipcMain.on('set-open-file-name', (event, filename) => {
		const window = getWindow(event);
		window.setTitle(
			filename ? `${filename} - CPG UI Client` : 'CPG UI Client',
		);
	});

	ipcMain.on('copy', (event, str) => {
		handleClipBoardActivity('copy', str);
	});

	ipcMain.on('paste', event => {
		const window = getWindow(event);
		const clip_board_value = handleClipBoardActivity('paste');
		window.webContents.send('pasted-from-clipboard', clip_board_value);
	});
	// eslint-disable-next-line no-console
	console.log('all ipc inited and waiting for connection');
};

export const updateWindowInfo = window => {
	window.on('maximize', () => {
		window.webContents.send('window-info', {
			isMaximized: true,
		});
	});
	window.on('unmaximize', () => {
		window.webContents.send('window-info', {
			isMaximized: false,
		});
	});
};

export const openDevTools = window => {
	window.webContents.openDevTools();
};

export const listenForConnectionClose = connection => {
	ipcMain.on('websocket-disconnect', () => {
		connection.close(null, 'user terminated connection');
	});
};
