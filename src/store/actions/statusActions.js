export const setStatus = status => {
  return dispatch => {
    dispatch({
      type: 'SET_STATUS',
      payload: status,
    });
  };
};

export const setConnected = connected => {
  return dispatch => {
    dispatch(setStatus({ connected }));
  };
};

export const setToast = toast => {
  return dispatch => {
    dispatch(setStatus({ toast }));
  };
};
