import { expose } from 'threads/worker';
import { parseCircuitUIResponseValue } from './views/terminal_window/terminalWindowWorkerScripts';
import { handleToggleAllSubBlocks } from './components/ui_query_response/uiQueryResponseWorkerScripts';

expose({
	parseCircuitUIResponseValue,
	handleToggleAllSubBlocks,
});
