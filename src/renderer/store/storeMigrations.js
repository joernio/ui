const migrations = {
	0: state => ({
		...state,
		settings: {
			...state.settings,
			queryShortcuts: {},
		},
	}),
	1: state => ({
		...state,
		terminal: {
			...state.terminal,
			circuit_ui_responses: {
				length: 0,
				dropdown: true,
				all: {},
				indexes: [],
			},
		},
	}),
};

export default migrations;
