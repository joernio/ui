export const setSettings = setting => dispatch => {
	dispatch({
		type: 'SET_SETTINGS',
		payload: setting,
	});
};

export const setQueryShortcuts = payload => dispatch =>
	dispatch({
		type: 'SET_QUERY_SHORTCUTS',
		payload,
	});
