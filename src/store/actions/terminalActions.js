export const setTerminal = payload => {
  console.log('setTerminal: ', payload);
  return dispatch => {
    dispatch({
      type: 'SET_TERMINAL',
      payload,
    });
  };
};

export const setTerm = term => {
  console.log('setTerm: ', term);
  return dispatch => {
    dispatch(setTerminal({ term }));
  };
};

export const setRefs = refs => {
  console.log('setRefs: ', ref);
  return dispatch => {
    dispatch(setTerminal({ refs }));
  };
};

export const setFitAddon = fitAddon => {
  console.log('setFitAddon: ', fitAddon);
  return dispatch => {
    dispatch(setTerminal({ fitAddon }));
  };
};

export const setPrevResults = prev_results => {
  console.log('setPrevResults: ', prev_results);
  return dispatch => {
    dispatch(setTerminal({ prev_results }));
  };
};

export const setPrevWorkspace = prev_workspace => {
  console.log('setPrevWorkspace: ', prev_workspace);
  return dispatch => {
    dispatch(setTerminal({ prev_workspace }));
  };
};

export const setIsMaximized = obj => {
  console.log('setIsMaximized: ', obj);
  return dispatch => {
    dispatch(setTerminal(obj));
  };
};

export const setHistory = history => {
  console.log('setHistory: ', history);
  return dispatch => {
    dispatch(setTerminal({ history }));
  };
};

export const setTerminalBusy = busy => {
  console.log('setTerminalBusy: ', busy);
  return dispatch => {
    dispatch(setTerminal({ busy }));
  };
};

export const setQuerySuggestions = query_suggestions => {
  console.log('setQuerySuggestions: ', query_suggestions);
  return dispatch => {
    dispatch(setTerminal({ query_suggestions }));
  };
};
