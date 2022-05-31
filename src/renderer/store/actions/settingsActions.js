export const setSettings = payload => dispatch => {
	dispatch({
		type: 'SET_SETTINGS',
		payload,
	});
};

export const setServer = payload => dispatch => {
	dispatch({
		type: 'SET_SERVER',
		payload,
	});
};

export const setWebSocket = payload => dispatch => {
	dispatch({
		type: 'SET_WEBSOCKET',
		payload,
	});
};

export const setPrefersDarkMode = payload => dispatch => {
	dispatch({
		type: 'SET_PREFERSDARKMODE',
		payload,
	});
};

export const setPrefersTerminalView = payload => dispatch => {
	dispatch({
		type: 'SET_PREFERSTERMINALVIEW',
		payload,
	});
};

export const setFontSize = payload => dispatch => {
	dispatch({
		type: 'SET_FONTSIZE',
		payload,
	});
};

export const setScriptsDir = payload => dispatch => {
	dispatch({
		type: 'SET_SCRIPTSDIR',
		payload,
	});
};

export const setUIIgnore = payload => dispatch => {
	dispatch({
		type: 'SET_UIIGNORE',
		payload,
	});
};

export const setQueryShortcuts = payload => dispatch =>
	dispatch({
		type: 'SET_QUERY_SHORTCUTS',
		payload,
	});
