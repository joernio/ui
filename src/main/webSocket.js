/* eslint-disable no-console */
import { client as WebSocketClient } from 'websocket';

const initWebSocket = async (window, ws_url) => {
	// eslint-disable-next-line import/no-cycle
	const { listenForConnectionClose } = await import('./ipcMain')
		.then(ipcMain => ipcMain)
		.catch(console.log);

	const client = new WebSocketClient();

	client.on('connectFailed', () => {
		window.webContents.send('websocket-connection-failed');
	});

	client.on('connect', connection => {
		console.log('WebSocket Client Connected');
		window.webContents.send('websocket-connected');

		listenForConnectionClose(connection);

		connection.on('error', () => {
			window.webContents.send('websocket-connection-failed');
		});

		connection.on('close', () => {
			window.webContents.send('websocket-connection-failed');
			console.log('echo-protocol Connection Closed');
		});

		connection.on('message', data => {
			console.log('websocket message received');
			if (data.type === 'utf8' && data.utf8Data !== 'connected') {
				window.webContents.send('websocket-response', data);
			} else {
				console.log("websocket message says 'connected'. Ignoring");
			}
		});
	});

	client.connect(ws_url, []);
};

export default initWebSocket;
