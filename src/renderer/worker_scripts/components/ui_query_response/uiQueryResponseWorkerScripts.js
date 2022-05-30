export const handleToggleAllSubBlocks = data => {
	const { block_id, circuit_ui_responses } = data;
	const ui_response = circuit_ui_responses.all[block_id].ui_response;

	ui_response.dropdown = !ui_response.dropdown;

	Object.keys(ui_response.responses).forEach(sub_block_id => {
		const sub_block = ui_response.responses[sub_block_id];
		sub_block.dropdown = ui_response.dropdown;
	});

	return circuit_ui_responses;
};
