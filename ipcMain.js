const { BrowserWindow, ipcMain, Notification, dialog } = require('electron');

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
    case 'close':
      window.close();
      return true;
    default:
      console.error(`Invalid window action: ${action}`);
      return false;
  }
};

const initIpcMain = () => {
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

  ipcMain.on('select-dir', async (event, _) => {
    const window = getWindow(event);
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
    });

    window.webContents.send('selected-dir', result.filePaths[0]);
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

module.exports = { initIpcMain, updateWindowInfo, openDevTools };
