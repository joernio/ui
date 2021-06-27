import { ipcRenderer as ipc } from 'electron';
import { handleWebSocketResponse } from './scripts';

export const windowActionApi = {
  sendWindowAction: message => {
    ipc.send('window-action', message);
  },
};

export const windowInfoApi = {
  getWindowInfo: () => {
    ipc.send('get-window-info', null);
  },
};

export const NotificationApi = {
  notify: message => {
    ipc.send('notify', message);
  },
};

export const selectDirApi = {
  selectDir: () => {
    ipc.send('select-dir');
  },
  registerListener: callback => {
    ipc.once('selected-dir', (e, data) => callback(data));
  },
};

const initIPCRenderer = () => {
  ipc.on('websocket-response', (e, data) => {
    handleWebSocketResponse(data);
  });
};

export default initIPCRenderer;
