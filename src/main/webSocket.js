// eslint-disable-next-line import/no-unresolved
import { client as WebSocketClient } from 'websocket';

const initWebSocket = async (window, ws_url) => {
	// eslint-disable-next-line import/no-cycle
	const { listenForConnectionClose } = await import('./ipcMain')
		.then(ipcMain => ipcMain)
		.catch(console.log); // eslint-disable-line no-console

	const client = new WebSocketClient();

	client.on('connectFailed', () => {
		window.webContents.send('websocket-connection-failed');
	});

	client.on('connect', connection => {
		// eslint-disable-next-line no-console
		console.log('WebSocket Client Connected');
		window.webContents.send('websocket-connected');

		listenForConnectionClose(connection);

		connection.on('error', () => {
			window.webContents.send('websocket-connection-failed');
		});

		connection.on('close', () => {
			window.webContents.send('websocket-connection-failed');
			// eslint-disable-next-line no-console
			console.log('echo-protocol Connection Closed');
		});

		connection.on('message', data => {
			// eslint-disable-next-line no-console
			console.log('websocket message received');
			if (data.type === 'utf8' && data.utf8Data !== 'connected') {
				window.webContents.send('websocket-response', data);
			} else {
				// eslint-disable-next-line no-console
				console.log("websocket message says 'connected'. Ignoring");
			}
		});
	});

	client.connect(ws_url, []);
};

export default initWebSocket;
