const migrations = {
	0: state => ({
		state,
		settings: {
			...state.settings,
			queryShortcuts: {},
		},
	}),
};

export default migrations;
