export const setTerminal = payload => dispatch => {
	dispatch({
		type: 'SET_TERMINAL',
		payload,
	});
};

export const setTerm = term => dispatch => {
	dispatch(setTerminal({ term }));
};

export const setRefs = refs => dispatch => {
	dispatch(setTerminal({ refs }));
};

export const setFitAddon = fitAddon => dispatch => {
	dispatch(setTerminal({ fitAddon }));
};

export const setPrevResults = prev_results => dispatch => {
	dispatch(setTerminal({ prev_results }));
};

export const setPrevProjects = prev_projects => dispatch => {
	dispatch(setTerminal({ prev_projects }));
};

export const setIsMaximized = obj => dispatch => {
	dispatch(setTerminal(obj));
};

export const setHistory = history => dispatch => {
	dispatch(setTerminal({ history }));
};

export const setTerminalBusy = busy => dispatch => {
	dispatch(setTerminal({ busy }));
};

export const setQuerySuggestions = query_suggestions => dispatch => {
	dispatch(setTerminal({ query_suggestions }));
};

export const setCircuitUIResponses = circuit_ui_responses => dispatch => {
	dispatch(setTerminal({ circuit_ui_responses }));
};
