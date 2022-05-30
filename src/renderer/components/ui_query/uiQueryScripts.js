import { deepClone } from '../../assets/js/utils/scripts';

import { store } from '../../store/configureStore';
import { setCircuitUIResponses } from '../../store/actions/terminalActions';

export const handleToggleBlock = (block_id, cache, vList) => {
	const circuit_ui_responses = deepClone(
		store.getState().terminal.circuit_ui_responses,
	);

	const dropdown = circuit_ui_responses.all[block_id].dropdown;
	circuit_ui_responses.all[block_id].dropdown = !dropdown;
	store.dispatch(setCircuitUIResponses(circuit_ui_responses));

	cache.clearAll();
	vList.recomputeRowHeights();
};
