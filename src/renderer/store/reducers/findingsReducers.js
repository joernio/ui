const default_state = {
	open_sarif_finding_path: '',
	triages: {},
	triage_ids: [],
};

const findings = (state = default_state, action) => {
	switch (action.type) {
		case 'SET_FINDINGS':
			return {
				...state,
				...action.payload,
			};
		case 'SET_TRIAGE':
			return {
				...state,
				triages: { ...state.triages, ...action.payload },
			};
		default:
			return state;
	}
};

export default findings;
