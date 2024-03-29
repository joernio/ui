const default_state = {
	term: null,
	refs: null,
	fitAddon: null,
	prev_results: null,
	prev_projects: {},
	history: {
		prev_queries: {},
		next_queries: {},
	},
	isMaximized: true,
	busy: false,
	query_suggestions: [],
	suggestion_dialog_open: false,
	circuit_ui_responses: { length: 0, dropdown: true, all: {}, indexes: [] },
};

const terminal = (state = default_state, action) => {
	switch (action.type) {
		case 'SET_TERMINAL':
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export default terminal;
