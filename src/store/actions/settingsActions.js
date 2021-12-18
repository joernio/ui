export const setSettings = setting => {
  return dispatch => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: setting,
    });
  };
};

export const setQueryShortcuts = payload => {
  return dispatch => {
    return dispatch({
      type: 'SET_QUERY_SHORTCUTS',
      payload,
    });
  };
};
