import { ipcRenderer as ipc } from 'electron';
import { handleWebSocketResponse } from './scripts';
import { setConnected } from '../../../store/actions/statusActions';
import { store } from '../../../store/configureStore';

export const windowActionApi = {
	sendWindowAction: message => {
		ipc.send('window-action', message);
	},
	setOpenFileName: filename => {
		ipc.send('set-open-file-name', filename);
	},
	connectToWebSocketAction: ws_url => {
		ipc.send('websocket-connect', ws_url);
	},
	disconnectFromWebSocketAction: () => {
		ipc.send('websocket-disconnect');
	},
	copyToClipBoard: str => {
		ipc.send('copy', str);
	},
	pasteFromClipBoard: () => ipc.send('paste'),
	registerPasteFromClipBoardListener: callback => {
		ipc.once('pasted-from-clipboard', (e, str) => callback(str));
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
	selectDir: event_name => {
		ipc.send(event_name);
	},
	registerListener: (event_name, callback) => {
		ipc.once(event_name, (e, data) => callback(data));
	},
	createFile: defaultPath => {
		ipc.send('create-file', defaultPath);
	},
	registerCreatedFileListener: callback => {
		ipc.once('created-file', (e, file) => callback(file));
	},
};

const initIPCRenderer = ws_url => {
	ipc.on('websocket-connection-failed', () => {
		store.dispatch(setConnected(false));
	});

	ipc.on('websocket-connected', () => {
		store.dispatch(setConnected(true));
	});

	ipc.on('websocket-response', (e, data) => {
		handleWebSocketResponse(data);
	});

	windowActionApi.connectToWebSocketAction(ws_url);
};

export default initIPCRenderer;
