export const setSettings = setting => {
  return dispatch => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: setting,
    });
  };
};

export const setQueryShortcut = payload => {
  console.log('setQueryShortcut action: payload is ', payload);
  return dispatch => {
    return dispatch({
      type: 'SET_QUERY_SHORTCUTS',
      payload,
    });
  };
};
