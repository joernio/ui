export const setSettings = setting => {
  return dispatch => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: setting,
    });
  };
};
