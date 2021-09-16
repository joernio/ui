const { BrowserWindow } = require('electron');
const { getWindowPosition } = require('./config');
const { updateWindowInfo, openDevTools } = require('./ipcMain');
const path = require('path');

const isMac = process.platform === 'darwin';

const createWindow = async () => {
  const { position, size } = getWindowPosition();

  const window = new BrowserWindow({
    title: 'CPG UI Client',
    // titleBarStyle: 'hiddenInset',
    // icon: path.resolve(__dirname, './src/assets/image/icon.svg'),
    frame: true,
    // transparent: isMac,
    acceptFirstMouse: true,
    webPreferences: {
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

  window.loadFile('index.html');

  return window;
};

module.exports = { createWindow };
