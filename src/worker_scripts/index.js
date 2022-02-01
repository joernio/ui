importScripts(
  '../../src/worker_scripts/views/terminal_window/terminalWindowWorkerScripts.js',
);

addEventListener('message', e => {
  const func = Object.keys(e.data)[0];
  this[func](e.data);
});
