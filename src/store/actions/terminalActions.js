export const setTerminal = payload => {
  return dispatch => {
    dispatch({
      type: 'SET_TERMINAL',
      payload,
    });
  };
};

export const setTerm = term => {
  return dispatch => {
    dispatch(setTerminal({ term }));
  };
};

export const setFitAddon = fitAddon => {
  return dispatch => {
    dispatch(setTerminal({ fitAddon }));
  };
};

export const setPrevResults = prev_results => {
  return dispatch => {
    dispatch(setTerminal({ prev_results }));
  };
};

export const setPrevWorkspace = prev_workspace => {
  return dispatch => {
    dispatch(setTerminal({ prev_workspace }));
  };
};

export const setIsMaximized = obj => {
  return dispatch => {
    dispatch(setTerminal(obj));
  };
};

export const setHistory = history => {
  return dispatch => {
    dispatch(setTerminal({ history }));
  };
};

export const setTerminalBusy = busy => {
  return dispatch => {
    dispatch(setTerminal({ busy }));
  };
};

export const setQuerySuggestions = query_suggestions => {
  return dispatch => {
    dispatch(setTerminal({ query_suggestions }));
  };
};
