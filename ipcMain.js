const { BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const initWebSocket = require('./webSocket');

const getWindow = event => {
  const window = BrowserWindow.fromId(event.frameId);
  if (!window) throw new Error('Window not found');
  return window;
};

const handleWindowAction = (action, window) => {
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
      console.error(`Invalid window action: ${action}`);
      return false;
  }
};

const initIpcMain = () => {
  ipcMain.on('websocket-connect', (event, ws_url) => {
    const window = getWindow(event);
    initWebSocket(window, ws_url);
  });

  ipcMain.on('window-action', (event, message) => {
    return handleWindowAction(message, getWindow(event));
  });

  ipcMain.on('get-window-info', (event, _) => {
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
};

const updateWindowInfo = window => {
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

const openDevTools = window => {
  window.webContents.openDevTools();
};

const listenForConnectionClose = connection => {
  ipcMain.on('websocket-disconnect', () => {
    connection.close(null, 'user terminated connection');
  });
};

module.exports = {
  initIpcMain,
  updateWindowInfo,
  openDevTools,
  listenForConnectionClose,
};
