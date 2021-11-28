const WebSocketClient = require('websocket').client;

function initWebSocket(window, ws_url) {
  const { listenForConnectionClose } = require('./ipcMain');
  const client = new WebSocketClient();

  client.on('connectFailed', _ => {
    window.webContents.send('websocket-connection-failed');
  });

  client.on('connect', connection => {
    console.log('WebSocket Client Connected');
    window.webContents.send('websocket-connected');

    listenForConnectionClose(connection);

    connection.on('error', _ => {
      window.webContents.send('websocket-connection-failed');
    });

    connection.on('close', _ => {
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
}

module.exports = initWebSocket;
