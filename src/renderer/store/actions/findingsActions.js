export const setFindings = payload => dispatch => {
	dispatch({
		type: 'SET_FINDINGS',
		payload,
	});
};

export const setTriage = payload => dispatch => {
	dispatch({
		type: 'SET_TRIAGE',
		payload,
	});
};
