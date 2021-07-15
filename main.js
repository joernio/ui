const { app, BrowserWindow } = require('electron');
const { createWindow } = require('./window');
const path = require('path');
const { initIpcMain } = require('./ipcMain');

const isDev = !app.isPackaged;

function initIpcAndWindow() {
  initIpcMain();
  createWindow();
}

function init() {
  app.on('ready', () => {
    initIpcAndWindow();
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      initIpcAndWindow();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  if (isDev) {
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    });
  }
}

init();
