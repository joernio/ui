import { deepClone, openFile } from '../../assets/js/utils/scripts';
import { store } from '../../store/configureStore';
import { setCircuitUIResponses } from '../../store/actions/terminalActions';

import { setHighlightRange } from '../../store/actions/editorActions';

export const { workerPool } = store.getState().query;

export const handleToggleAllSubBlocks = (
	block_id,
	rowsRendered,
	cache,
	vList,
) => {
	const circuit_ui_responses = deepClone(
		store.getState().terminal.circuit_ui_responses,
	);

	const over_scan_start_index = rowsRendered.overscanStartIndex || 0;
	const over_scan_stop_index =
		rowsRendered.overscanStopIndex || circuit_ui_responses.length - 1;

	for (
		let index = over_scan_start_index;
		index <= over_scan_stop_index;
		index += 1
	) {
		const { block_id, sub_block_id } = circuit_ui_responses.indexes[index];
		const ui_response = circuit_ui_responses.all[block_id].ui_response;
		const sub_block = ui_response.responses[sub_block_id];
		if (sub_block) {
			sub_block.dropdown = !ui_response.dropdown;
		}
	}

	store.dispatch(setCircuitUIResponses(circuit_ui_responses));
	cache.clearAll();
	vList.recomputeGridSize(over_scan_start_index);

	workerPool
		.queue(worker =>
			worker.handleToggleAllSubBlocks({ block_id, circuit_ui_responses }),
		)
		.then(circuit_ui_responses => {
			store.dispatch(setCircuitUIResponses(circuit_ui_responses));
			cache.clearAll();
			vList.recomputeGridSize(over_scan_start_index);
		});
};

export const handleToggleSubBlock = (block_id, sub_block_id, measure) => {
	const circuit_ui_responses = deepClone(
		store.getState().terminal.circuit_ui_responses,
	);
	const sub_block =
		circuit_ui_responses.all[block_id].ui_response.responses[sub_block_id];
	sub_block.dropdown = !sub_block.dropdown;

	store.dispatch(setCircuitUIResponses(circuit_ui_responses));
	setTimeout(measure, 0);
};

export const openFileAndGoToLineFromCircuitUI = async ({
	filename,
	lineNumber: startLine,
	lineNumberEnd: endLine,
}) => {
	if (
		filename &&
		filename !== '<empty>' &&
		filename.split('<').length === 1 &&
		startLine &&
		endLine
	) {
		startLine = Number(
			startLine.replace('Some(value = ', '').replace(')', ''),
		);
		endLine = Number(endLine.replace('Some(value = ', '').replace(')', ''));
		await openFile(filename);
		store.dispatch(setHighlightRange({ startLine, endLine }));
	}
};
