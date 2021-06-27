const WebSocketClient = require('websocket').client;
const { Notification } = require('electron');

function initWebSocket(window) {
  const client = new WebSocketClient();

  client.on('connectFailed', error => {
    new Notification({ title: 'Notification', body: error.toString() }).show();
  });

  client.on('connect', connection => {
    console.log('WebSocket Client Connected');

    connection.on('error', error => {
      new Notification({
        title: 'Notification',
        body: error.toString(),
      }).show();
    });

    connection.on('close', message => {
      console.log('echo-protocol Connection Closed');
      new Notification({
        title: 'Notification',
        body: message.toString(),
      }).show();
    });

    connection.on('message', data => {
      console.log('websocket message recieived');
      if (data.type === 'utf8' && data.utf8Data !== 'connected') {
        window.webContents.send('websocket-response', data);
      } else {
        console.log("websocket message says 'connected'. Ignoring");
      }
    });
  });

  client.connect('ws://localhost:8080/connect', []);
}

module.exports = initWebSocket;
