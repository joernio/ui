export const setStatus = status => dispatch => {
	dispatch({
		type: 'SET_STATUS',
		payload: status,
	});
};

export const setConnected = connected => dispatch => {
	dispatch(setStatus({ connected }));
};

export const setToast = toast => dispatch => {
	dispatch(setStatus({ toast }));
};
