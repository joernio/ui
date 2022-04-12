import { parseCircuitUIResponseValue } from './views/terminal_window/terminalWindowWorkerScripts';
const methods = {
  parseCircuitUIResponseValue,
};

addEventListener('message', e => {
  const func = Object.keys(e.data)[0];
  methods[func](e.data);
});
