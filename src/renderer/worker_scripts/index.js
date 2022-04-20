import { expose } from 'threads/worker';
import { parseCircuitUIResponseValue } from './views/terminal_window/terminalWindowWorkerScripts';

expose({
	parseCircuitUIResponseValue,
});
