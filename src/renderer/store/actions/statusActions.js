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

export const setSettingsDialogIsOpen = settingsDialogIsOpen => dispatch => {
	dispatch(setStatus({ settingsDialogIsOpen }));
};

export const setDiscardDialog = discardDialog => dispatch => {
	dispatch(setStatus({ discardDialog }));
};
